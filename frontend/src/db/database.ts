import { createRxDatabase, addRxPlugin, RxDatabase, RxStorage } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

import { projectSchema } from './schemas/project.schema';
import { areaSchema } from './schemas/area.schema';
import { taskSchema } from './schemas/task.schema';
import { resourceSchema } from './schemas/resource.schema';
import { habitSchema } from './schemas/habit.schema';
import { metricSchema } from './schemas/metric.schema';
import { logSchema } from './schemas/log.schema';

// Enable dev mode plugins
// @ts-ignore - Vite env types might be missing in current TS config
if (import.meta.env.DEV) {
    addRxPlugin(RxDBDevModePlugin);
}

// Type Definitions (Expand as needed with generated types)
export type KernelDatabase = RxDatabase;

let dbPromise: Promise<KernelDatabase> | null = null;

// Exporting createDatabase for testing purposes
export const createDatabase = async (password?: string): Promise<KernelDatabase> => {
    console.log('Initializing RxDB...');

    let storage: RxStorage<any, any> = getRxStorageDexie();

    // Enable encryption if password is provided (or always for now since we use schemas with encrypted fields)
    // For MVP, we default to a simplified handling where encryption is always enabled when needed
    if (password) {
        storage = wrappedKeyEncryptionCryptoJsStorage({
            storage
        });
    }

    const db = await createRxDatabase({
        name: 'kernel_db',
        storage,
        password,
        ignoreDuplicate: true, // Useful for HMR
    });

    console.log('RxDB created, ensuring collections...');

    await db.addCollections({
        projects: { schema: projectSchema },
        areas: { schema: areaSchema },
        tasks: { schema: taskSchema },
        resources: { schema: resourceSchema },
        habits: { schema: habitSchema },
        metrics: { schema: metricSchema },
        logs: { schema: logSchema },
    });

    console.log('RxDB collections initialized');
    return db;
};

export const getDatabase = (password?: string) => {
    if (!dbPromise) {
        // Mock MVP password if not provided. In production this should come from user/env.
        // In TEST environment, default to NO password to avoid slow encryption/crypto issues in simple unit tests,
        // unless explicitly provided.
        if (import.meta.env.MODE === 'test' && !password) {
            dbPromise = createDatabase(undefined);
        } else {
            // For Story 6.3 AC, we need password input mechanism but "Mock for MVP: 可先寫死"
            const finalPassword = password || 'mvp-secret-password-123';
            dbPromise = createDatabase(finalPassword);
        }
    }
    return dbPromise;
};
