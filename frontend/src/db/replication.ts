import { RxCollection } from 'rxdb';
import { RxReplicationState, replicateRxCollection } from 'rxdb/plugins/replication';

export const syncCollection = (
    collection: RxCollection,
    remoteUrl: string, // Base URL of CouchDB e.g. http://localhost:5984/
    tokenProvider?: () => string | null,
    basicAuth?: { username?: string, password?: string }
): RxReplicationState<any, any> => {

    // Ensure remoteUrl ends with slash if not provided
    let baseUrl = remoteUrl.endsWith('/') ? remoteUrl : remoteUrl + '/';
    const dbUrl = `${baseUrl}${collection.name}`;

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
            async handler(docs) {
                const url = `${dbUrl}/_bulk_docs`;
                const body = { docs };

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify(body)
                    });
                    if (!response.ok) throw new Error('Push failed: ' + response.statusText);

                    // CouchDB returns array of statuses, we need to parse them if needed
                    // For now, assume success if 200/201
                    return []; // Empty array means success for all docs
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
