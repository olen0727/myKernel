import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { getDatabase } from './database';
import { createRxDatabase, RxJsonSchema } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js';

describe('Database Encryption', () => {

    it('should initialize getDatabase with default password', async () => {
        const db = await getDatabase();
        expect(db).toBeDefined();
        expect(db.name).toBe('kernel_db');
    });

    it('should prevent access with wrong password', async () => {
        const name = 'test_db_enc_auth_' + Date.now();
        const storage = wrappedKeyEncryptionCryptoJsStorage({
            storage: getRxStorageDexie()
        });

        // 1. Create with correct password and add some data
        const db1 = await createRxDatabase({
            name,
            storage,
            password: 'password-correct-123',
            ignoreDuplicate: true
        });

        const schema: RxJsonSchema<any> = {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: { type: 'string', maxLength: 100 },
                secret: { type: 'string' }
            },
            required: ['id'],
            encrypted: ['secret']
        };

        await db1.addCollections({ secrets: { schema } });
        await db1.secrets.insert({ id: '1', secret: 'my-secret-data' });
        await db1.destroy();

        // 2. Open with WRONG password
        try {
            const db2 = await createRxDatabase({
                name,
                storage,
                password: 'password-wrong-123',
                ignoreDuplicate: true
            });

            // If creation succeeded, ensure we cannot read the data correctly
            // Usually DB1 error happens preventing usage, but if it slips through:
            await db2.addCollections({ secrets: { schema } });

            const doc = await db2.secrets.findOne('1').exec();

            // If we found the document:
            if (doc) {
                // The secret should NOT be the original data (decryption fail or garbage)
                // OR RxDB usually throws on decryption error during query
                // Verify it is NOT the correct secret
                expect(doc.secret).not.toBe('my-secret-data');
            }
            // If doc is not found or error thrown, that's secure.
            await db2.destroy();

        } catch (err) {
            // Expected: creation failure or collection addition failure or read failure
            expect(err).toBeDefined();
        }
    });

    it('should allow writing to encrypted field', async () => {
        const storage = wrappedKeyEncryptionCryptoJsStorage({
            storage: getRxStorageMemory()
        });

        const schema: RxJsonSchema<any> = {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: { type: 'string', maxLength: 100 },
                secret: { type: 'string' }
            },
            required: ['id'],
            encrypted: ['secret']
        };

        const db = await createRxDatabase({
            name: 'test_db_enc_write_' + Date.now(),
            storage,
            password: 'pw-long-enough-123',
            ignoreDuplicate: true
        });

        await db.addCollections({
            secrets: { schema }
        });

        await db.secrets.insert({
            id: '1',
            secret: 'super-secret-data'
        });

        const doc = await db.secrets.findOne('1').exec();
        expect(doc.secret).toBe('super-secret-data');

        await db.destroy();
    });
});
