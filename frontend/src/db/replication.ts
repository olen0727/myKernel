import { RxCollection } from 'rxdb';
import { RxReplicationState, replicateRxCollection } from 'rxdb/plugins/replication';

export const syncCollection = (
    collection: RxCollection,
    remoteUrl: string, // Base URL of CouchDB e.g. http://localhost:5984/
    tokenProvider?: () => string | null,
    basicAuth?: { username?: string, password?: string }
): RxReplicationState<any, any> => {

    // Use the provided remoteUrl as the exact DB URL
    const dbUrl = remoteUrl;


    const useBasicAuth = basicAuth?.username && basicAuth?.password;

    const getHeaders = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (useBasicAuth) {
            const credentials = btoa(`${basicAuth.username}:${basicAuth.password}`);
            headers['Authorization'] = `Basic ${credentials}`;
        } else {
            const token = tokenProvider ? tokenProvider() : null;
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    };

    const replicationState = replicateRxCollection({
        replicationIdentifier: 'couchdb-custom-' + collection.name,
        collection,
        pull: {
            batchSize: 60,
            async handler(lastCheckpoint, batchSize) {
                // @ts-ignore
                const minSeq = lastCheckpoint ? lastCheckpoint.sequence : 0;
                const url = `${dbUrl}/_changes?style=all_docs&feed=normal&include_docs=true&limit=${batchSize}&since=${minSeq}`;

                try {
                    const response = await fetch(url, { headers: getHeaders() });
                    if (!response.ok) throw new Error('Pull failed: ' + response.statusText);
                    const data = await response.json();

                    console.log(`[Replication Debug] Pull _changes for ${collection.name}:`, data.results.map((r: any) => ({
                        id: r.id,
                        deleted: r.deleted,
                        docDeleted: r.doc?._deleted,
                        changes: r.changes
                    })));

                    const primaryPath = collection.schema.primaryPath;

                    const documents = data.results
                        .filter((row: any) => !row.id.startsWith('_design/')) // Skip design docs
                        .map((row: any) => {
                            const doc = row.doc;
                            // Fix: Ensure primary key exists (map _id to id)
                            // CouchDB uses _id, but RxDB schema might use 'id' or something else
                            if (!doc[primaryPath] && doc._id) {
                                doc[primaryPath] = doc._id;
                            }
                            // [FIX] Ensure deleted documents are marked as such
                            // CouchDB _changes with include_docs might return the doc body but we rely on row.deleted
                            if (row.deleted) {
                                doc._deleted = true;
                            }
                            return doc;
                        });

                    return {
                        documents,
                        checkpoint: {
                            sequence: data.last_seq
                        }
                    };
                } catch (err) {
                    console.error(`Pull Error [${collection.name}]:`, err);
                    throw err;
                }
            }
        },
        push: {
            batchSize: 60,
            async handler(rows) {
                const url = `${dbUrl}/_bulk_docs`;
                const primaryPath = collection.schema.primaryPath;

                // 1. Prepare docs: extract from rows and map primary key to _id
                const preparedDocs = rows.map((row: any) => {
                    const d: any = { ...row.newDocumentState };
                    if (!d._id && d[primaryPath]) {
                        d._id = d[primaryPath];
                    }
                    if (!d._id && d.id) {
                        d._id = d.id;
                    }
                    return d;
                });

                // 2. Fetch latest revisions from CouchDB (Last Write Wins)
                const ids = preparedDocs.map((d: any) => d._id).filter((id: any) => !!id);
                if (ids.length > 0) {
                    const revsUrl = `${dbUrl}/_all_docs`;
                    try {
                        const revsResponse = await fetch(revsUrl, {
                            method: 'POST',
                            headers: getHeaders(),
                            body: JSON.stringify({ keys: ids })
                        });

                        if (revsResponse.ok) {
                            const revsData = await revsResponse.json();
                            const revMap = new Map<string, { rev: string, deleted: boolean }>();
                            if (revsData.rows) {
                                revsData.rows.forEach((row: any) => {
                                    if (row.value && row.value.rev) {
                                        revMap.set(row.id, { rev: row.value.rev, deleted: !!row.value.deleted });
                                    }
                                });
                            }
                            console.log(`[Replication Debug] IDs: ${ids.join(',')}, RevMap size: ${revMap.size}`);

                            // Attach latest _rev from CouchDB;
                            // For docs not found (e.g. already deleted in CouchDB),
                            // remove _rev so CouchDB treats them as new inserts
                            preparedDocs.forEach((d: any) => {
                                const serverState = revMap.get(d._id);
                                if (serverState) {
                                    d._rev = serverState.rev;
                                    // [OPTIMIZATION] If both local and server are deleted, skip pushing to avoid conflict loops
                                    if (d._deleted && serverState.deleted) {
                                        d._skipPush = true;
                                        // console.log(`[Replication Debug] Skipping redundant delete for ${d._id}`);
                                    }
                                } else {
                                    // console.warn(`No rev found for ${d._id} in revMap, treating as new`);
                                    delete d._rev;
                                }
                            });
                            // console.log('[Replication Debug] Prepared docs for push:', preparedDocs.map((d: any) => ({ id: d._id, rev: d._rev, deleted: d._deleted })));
                        }
                    } catch (e) {
                        console.warn("Failed to fetch revisions, attempting blind push...", e);
                    }
                }

                // Filter out docs marked for skip
                const docsToPush = preparedDocs.filter((d: any) => !d._skipPush);

                if (docsToPush.length === 0) {
                    return []; // Nothing to push, success
                }

                const body = { docs: docsToPush };

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify(body)
                    });

                    if (!response.ok) throw new Error('Push failed: ' + response.statusText);

                    const responseList = await response.json();
                    if (!Array.isArray(responseList)) return [];

                    // Separate conflict errors from other errors
                    const conflictIds: string[] = [];
                    const otherErrors: any[] = [];

                    responseList.forEach((res: any) => {
                        if (res.error === 'conflict') {
                            conflictIds.push(res.id);
                        } else if (res.error) {
                            otherErrors.push(res);
                        }
                    });

                    // For non-conflict errors, throw
                    if (otherErrors.length > 0) {
                        const errorMsg = otherErrors.map((e: any) => `${e.id}: ${e.error} (${e.reason})`).join('; ');
                        throw new Error(`Push partial failure: ${errorMsg}`);
                    }

                    // For conflicts: fetch current master state from CouchDB
                    // and return them so RxDB can resolve via its conflict handler
                    if (conflictIds.length > 0) {
                        console.warn(`Push conflicts [${collection.name}], resolving:`, conflictIds);
                        const masterDocs: any[] = [];

                        const allDocsResp = await fetch(`${dbUrl}/_all_docs?include_docs=true`, {
                            method: 'POST',
                            headers: getHeaders(),
                            body: JSON.stringify({ keys: conflictIds })
                        });

                        if (allDocsResp.ok) {
                            const allDocsData = await allDocsResp.json();
                            const foundIds = new Set<string>();
                            if (allDocsData.rows) {
                                allDocsData.rows.forEach((row: any) => {
                                    // Handle existing documents
                                    if (row.doc) {
                                        const doc = row.doc;
                                        if (!doc[primaryPath] && doc._id) {
                                            doc[primaryPath] = doc._id;
                                        }
                                        masterDocs.push(doc);
                                        foundIds.add(row.id);
                                    }
                                    // Handle deleted documents (Tombstones) found in _all_docs
                                    // CouchDB returns { id: '...', key: '...', value: { rev: '...', deleted: true }, doc: null }
                                    else if (row.value && row.value.deleted) {
                                        masterDocs.push({
                                            _id: row.id,
                                            _rev: row.value.rev,
                                            _deleted: true,
                                            [primaryPath]: row.id
                                        });
                                        foundIds.add(row.id);
                                    }
                                });
                            }

                            // For docs not found in _all_docs (deleted in CouchDB),
                            // fetch individually to get the tombstone
                            const missingIds = conflictIds.filter(id => !foundIds.has(id));
                            for (const docId of missingIds) {
                                try {
                                    const docResp = await fetch(
                                        `${dbUrl}/${encodeURIComponent(docId)}?revs=true&latest=true`,
                                        { headers: getHeaders() }
                                    );
                                    if (docResp.ok) {
                                        const doc = await docResp.json();
                                        if (!doc[primaryPath] && doc._id) {
                                            doc[primaryPath] = doc._id;
                                        }
                                        masterDocs.push(doc);
                                    }
                                } catch (e) {
                                    console.warn(`Could not fetch master state for ${docId}:`, e);
                                }
                            }
                        }

                        return masterDocs;
                    }

                    return [];
                } catch (err) {
                    console.error(`Push Error [${collection.name}]:`, err);
                    throw err;
                }
            }
        },
        live: true,
        waitForLeadership: false,
    });

    // Custom Stream / Polling implementation
    // CouchDB _changes feed is complex, so for stability we use a simple poller
    // that triggers a pull run every X seconds.
    // This bypasses the EventSource/401 issues completely.

    // [OPTIMIZATION] Focus-Only Sync Strategy
    // Commented out automatic polling as per user request to reduce background network traffic.
    // To restore background sync, uncomment the following block:
    /*
    if (true) { // live mode
        setInterval(async () => {
            // Trigger a pull
            // Accessing private property is hacky but standard workaround in RxDB for manual triggers
            // or valid method: replicationState.reSync()
            try {
                // @ts-ignore
                replicationState.reSync();
            } catch (e) { }
        }, 10000); // Poll every 10 seconds
    }
    */

    // NEW: Trigger sync ONLY when window gains focus
    if (typeof window !== 'undefined' && true) { // live mode
        const focusHandler = () => {
            if (replicationState.isStopped()) {
                window.removeEventListener('focus', focusHandler);
                return;
            }
            // console.log(`👀 Window focused, triggering sync for [${collection.name}]`);
            try {
                // @ts-ignore
                replicationState.reSync();
            } catch (e) { }
        };
        window.addEventListener('focus', focusHandler);
    }

    // Error logging
    replicationState.error$.subscribe(error => {
        console.error(`❌ Replication Error [${collection.name}]:`, error);
    });

    // Activity logging
    replicationState.sent$.subscribe(doc => {
        console.log(`📤 Pushing doc to CouchDB [${collection.name}]:`, doc);
    });

    replicationState.received$.subscribe(doc => {
        console.log(`📥 Received doc from CouchDB [${collection.name}]:`, doc);
    });

    return replicationState;
};
