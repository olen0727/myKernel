
import { describe, it, expect, vi } from 'vitest';
import { syncCollection } from './replication';
import { RxCollection } from 'rxdb';

// Mock replicateCouchDB
vi.mock('rxdb/plugins/replication-couchdb', () => ({
    replicateCouchDB: vi.fn().mockReturnValue({
        awaitInitialReplication: vi.fn(),
        cancel: vi.fn(),
    }),
}));

import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';

describe('Replication', () => {
    it('should start replication with correct parameters', () => {
        const mockCollection = {
            name: 'test_collection'
        } as unknown as RxCollection;

        const remoteUrl = 'http://localhost:5984/db';
        const token = 'mock-jwt-token';

        syncCollection(mockCollection, remoteUrl, () => token);

        expect(replicateCouchDB).toHaveBeenCalledWith(expect.objectContaining({
            replicationIdentifier: 'couchdb-test_collection',
            collection: mockCollection,
            url: `${remoteUrl}/test_collection/`,
            fetch: expect.any(Function),
            pull: expect.objectContaining({
                batchSize: 60,
                modifier: expect.any(Function),
                heartbeat: 60000,
            }),
            push: expect.objectContaining({
                batchSize: 60,
                modifier: expect.any(Function),
            }),
        }));
    });
});
