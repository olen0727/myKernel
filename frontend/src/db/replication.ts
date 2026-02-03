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
                    // Ensure _id exists for CouchDB
                    if (!d._id && d[primaryPath]) {
                        d._id = d[primaryPath];
                    }
                    // Fallback if primaryPath lookup failed but id exists
                    if (!d._id && d.id) {
                        d._id = d.id;
                    }
                    return d;
                });

                // 2. Fetch latest revisions for these docs to enable update/delete (Last Write Wins)
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
                            const revMap = new Map();
                            if (revsData.rows) {
                                revsData.rows.forEach((row: any) => {
                                    if (row.value && row.value.rev) {
                                        revMap.set(row.id, row.value.rev);
                                    }
                                });
                            }

                            // Attach _rev
                            preparedDocs.forEach((d: any) => {
                                const currentRev = revMap.get(d._id);
                                if (currentRev) {
                                    d._rev = currentRev;
                                }
                            });
                        }
                    } catch (e) {
                        console.warn("Failed to fetch revisions, attempting blind push...", e);
                    }
                }

                const body = { docs: preparedDocs };

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify(body)
                    });

                    if (!response.ok) throw new Error('Push failed: ' + response.statusText);

                    // Check for partial failures
                    const responseList = await response.json();

                    const errors = Array.isArray(responseList) ? responseList.filter((res: any) => res.error) : [];

                    if (errors.length > 0) {
                        const errorMsg = errors.map((e: any) => `${e.id}: ${e.error} (${e.reason})`).join('; ');
                        throw new Error(`Push partial failure: ${errorMsg}`);
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
