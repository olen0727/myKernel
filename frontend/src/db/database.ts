import { createRxDatabase, addRxPlugin, RxDatabase, RxStorage, removeRxDatabase } from 'rxdb';
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

// Type Definitions
import { Project, Area, Task, Resource, Habit, Metric, Log } from '../types/models';
import { RxCollection } from 'rxdb';

export type KernelCollections = {
    projects: RxCollection<Project>;
    areas: RxCollection<Area>;
    tasks: RxCollection<Task>;
    resources: RxCollection<Resource>;
    habits: RxCollection<Habit>;
    metrics: RxCollection<Metric>;
    logs: RxCollection<Log>;
};

export type KernelDatabase = RxDatabase<KernelCollections>;

// Prevent multiple instances during HMR (Hot Module Replacement)
let dbPromise: Promise<KernelDatabase> | null = null;
const _global = typeof window === 'object' ? window : global;
const DB_GLOBAL_KEY = 'kernel_db_instance';

const closeExistingDatabase = async () => {
    // @ts-ignore
    const existingDB = _global[DB_GLOBAL_KEY];
    if (existingDB) {
        console.log('♻️ Closing existing RxDB instance for HMR/Reload...');
        try {
            await existingDB.destroy();
        } catch (err) {
            console.warn('Failed to destroy existing DB:', err);
        }
        // @ts-ignore
        _global[DB_GLOBAL_KEY] = undefined;
    }
};

const createRecoveryError = (msg: string) => {
    const error = new Error(msg);
    error.name = 'DatabaseRecoveryError';
    return error;
};

// Exporting createDatabase for testing purposes
export const createDatabase = async (password?: string): Promise<KernelDatabase> => {
    // If we are creating a new database, ensure any old global instance is closed
    // This is critical for HMR environments
    // @ts-ignore
    if (import.meta.env.DEV) {
        await closeExistingDatabase();
    }

    console.log('Initializing RxDB...');

    let storage: RxStorage<any, any> = getRxStorageDexie();

    // Enable encryption if password is provided (or always for now since we use schemas with encrypted fields)
    // For MVP, we default to a simplified handling where encryption is always enabled when needed
    if (password) {
        storage = wrappedKeyEncryptionCryptoJsStorage({
            storage
        });
    }

    const dbConfig = {
        name: 'kernel_db',
        storage,
        password,
        ignoreDuplicate: true, // Useful for HMR
    };

    const init = async () => {
        const db = await createRxDatabase<KernelCollections>(dbConfig);
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

    let db;
    try {
        db = await init();
    } catch (err: any) {
        // Handle password mismatch (RxDB Error DB1)
        console.warn('⚠️ RxDB Error:', err.message);

        // Check if error is related to password mismatch (DB1)
        // This can happen at DB creation OR collection creation time if metadata conflicts
        const isPasswordError = err?.code === 'DB1' || err?.message?.includes('password');
        // @ts-ignore
        const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development';

        if (isPasswordError && isDevMode) {
            console.warn('⚠️ Database password mismatch detected. This usually happens when enabling encryption on an existing unencrypted database.');
            console.warn('♻️ Resetting database to apply new security settings...');

            try {
                // Must remove using the exact name and storage
                console.log('🧹 Attempting to clean up old database...');
                await removeRxDatabase('kernel_db', storage);

                // ALSO try removing with raw Dexie storage just in case the wrapper didn't clean up the underlying IDB completely
                await removeRxDatabase('kernel_db', getRxStorageDexie());

                console.log('✅ Old database removed. Recreating...');

                db = await init(); // Retry the whole init process
                console.log('✅ Database reset and recreated successfully.');
            } catch (resetErr) {
                console.error('❌ Failed to reset database:', resetErr);
                throw createRecoveryError('Database reset failed. Please manually clear your browser Application Storage (IndexedDB).');
            }
        } else {
            throw err;
        }
    }

    // Store in global for HMR cleanup
    // @ts-ignore
    if (import.meta.env.DEV) {
        // @ts-ignore
        _global[DB_GLOBAL_KEY] = db;
    }

    return db;
};

export const getDatabase = (password?: string) => {
    if (!dbPromise) {
        // For Story 6.3 AC, we need password input mechanism but "Mock for MVP: 可先寫死"
        // Also required for Schemas with encrypted fields
        const finalPassword = password || 'mvp-secret-password-123';
        dbPromise = createDatabase(finalPassword);
    }
    return dbPromise;
};
