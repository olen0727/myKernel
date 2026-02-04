import { createRxDatabase, addRxPlugin, RxDatabase, RxStorage, removeRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { syncCollection } from './replication';
import { AuthService } from '../services/auth-service';

import { projectSchema } from './schemas/project.schema';
import { areaSchema } from './schemas/area.schema';
import { taskSchema } from './schemas/task.schema';
import { resourceSchema } from './schemas/resource.schema';
import { habitSchema } from './schemas/habit.schema';
import { metricSchema } from './schemas/metric.schema';
import { logSchema } from './schemas/log.schema';

// Add the update plugin
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

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
const replicationStates: any[] = [];


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

const parseTimestamp = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value) {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.getTime();
        }
    }
    return undefined;
};

const normalizeLogDate = (value: unknown) => {
    if (typeof value === 'string') {
        const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) {
            return match[1];
        }
    }
    const timestamp = parseTimestamp(value);
    if (timestamp !== undefined) {
        return new Date(timestamp).toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
};

const toIsoString = (value: unknown) => {
    const timestamp = parseTimestamp(value);
    if (timestamp !== undefined) {
        return new Date(timestamp).toISOString();
    }
    return new Date().toISOString();
};

const getInternalCollectionDocId = (collectionName: string, version: number) =>
    `collection|${collectionName}-${version}`;

const cleanupDuplicateCollectionMeta = async (
    db: KernelDatabase,
    collectionName: string,
    currentVersion: number
) => {
    if (currentVersion <= 0) {
        return;
    }

    const ids = Array.from({ length: currentVersion }, (_, index) =>
        getInternalCollectionDocId(collectionName, index)
    );

    const found = await db.internalStore.findDocumentsById(ids, false);
    if (found.length <= 1) {
        return;
    }

    const keep = found.reduce((latest, doc) => {
        const latestVersion = latest.data?.version ?? -1;
        const docVersion = doc.data?.version ?? -1;
        return docVersion > latestVersion ? doc : latest;
    });

    const toDelete = found.filter(doc => doc.id !== keep.id);
    await db.internalStore.bulkWrite(
        toDelete.map(doc => ({
            previous: doc,
            document: { ...doc, _deleted: true }
        })),
        'cleanup-duplicate-collection-meta'
    );
};

const migrateLogDoc = (oldDoc: any) => {
    const nextDoc = { ...oldDoc };
    const dateSource = oldDoc.date ?? oldDoc.timestamp ?? oldDoc.createdAt ?? oldDoc.updatedAt;

    nextDoc.date = normalizeLogDate(dateSource);

    const inferredTimestamp = typeof oldDoc.timestamp === 'number'
        ? oldDoc.timestamp
        : parseTimestamp(dateSource) ?? parseTimestamp(oldDoc.createdAt) ?? parseTimestamp(oldDoc.updatedAt);

    if (inferredTimestamp !== undefined) {
        nextDoc.timestamp = inferredTimestamp;
    }

    if (nextDoc.details === null) {
        delete nextDoc.details;
    } else if (nextDoc.details !== undefined && typeof nextDoc.details !== 'string') {
        try {
            nextDoc.details = JSON.stringify(nextDoc.details);
        } catch (error) {
            nextDoc.details = String(nextDoc.details);
        }
    }

    if (nextDoc.value !== undefined && typeof nextDoc.value !== 'string') {
        nextDoc.value = String(nextDoc.value);
    }

    if (!nextDoc.action || typeof nextDoc.action !== 'string') {
        if (nextDoc.metricId) {
            nextDoc.action = 'metric_entry';
        } else if (nextDoc.habitId) {
            nextDoc.action = 'habit_check';
        } else if (nextDoc.details !== undefined) {
            nextDoc.action = 'daily_note';
        }
    }

    if (!nextDoc.createdAt || typeof nextDoc.createdAt !== 'string') {
        nextDoc.createdAt = toIsoString(nextDoc.timestamp ?? dateSource ?? Date.now());
    }

    if (!nextDoc.updatedAt || typeof nextDoc.updatedAt !== 'string') {
        nextDoc.updatedAt = nextDoc.createdAt;
    }

    return nextDoc;
};

const logMigrationStrategies = {
    1: (oldDoc: any) => migrateLogDoc(oldDoc),
    2: (oldDoc: any) => migrateLogDoc(oldDoc)
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
        name: 'kernel_db_v2',
        storage,
        password,
        ignoreDuplicate: true, // Useful for HMR
    };

    const init = async () => {
        const db = await createRxDatabase<KernelCollections>(dbConfig);
        console.log('RxDB created, ensuring collections...');
        await cleanupDuplicateCollectionMeta(db, 'logs', logSchema.version);
        await db.addCollections({
            projects: { schema: projectSchema },
            areas: { schema: areaSchema },
            tasks: {
                schema: taskSchema,
                migrationStrategies: {
                    1: (oldDoc: any) => {
                        const newDoc = { ...oldDoc };
                        // Migration: completed boolean -> status enum
                        if (oldDoc.completed === true) {
                            newDoc.status = 'done';
                        } else {
                            newDoc.status = 'todo';
                        }
                        delete newDoc.completed;
                        return newDoc;
                    }
                }
            },
            resources: { schema: resourceSchema },
            habits: { schema: habitSchema },
            metrics: { schema: metricSchema },
            logs: { schema: logSchema, migrationStrategies: logMigrationStrategies },
        });
        console.log('RxDB collections initialized');

        // Replication is now handled manually via syncDatabase()
        // to allow for user-specific DB URLs
        console.log('✅ RxDB initialized (Local Mode). Waiting for Auth to sync...');


        return db;
    };

    let db;
    try {
        db = await init();
    } catch (err: any) {
        // Handle password mismatch (RxDB Error DB1)
        console.warn('⚠️ RxDB Error:', err.message);

        // Check if error is related to password mismatch (DB1) or Schema mismatch (DB6)
        // This can happen at DB creation OR collection creation time if metadata conflicts
        const isRecoverableError =
            err?.code === 'DB1' ||
            err?.code === 'DB6' ||
            err?.message?.includes('password') ||
            err?.message?.includes('different schema');

        // @ts-ignore
        const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development';

        if (isRecoverableError && isDevMode) {
            console.warn('⚠️ Database configuration mismatch detected (Password or Schema).');
            console.warn('♻️ Resetting database to apply new settings...');

            try {
                // Must remove using the exact name and storage
                console.log('🧹 Attempting to clean up old database...');
                await removeRxDatabase('kernel_db_v2', storage);

                // ALSO try removing with raw Dexie storage just in case the wrapper didn't clean up the underlying IDB completely
                await removeRxDatabase('kernel_db_v2', getRxStorageDexie());

                console.log('✅ Old database removed. Recreating...');

                db = await init(); // Retry the whole init process
                console.log('✅ Database reset and recreated successfully.');
            } catch (resetErr) {
                console.error('❌ Failed to reset database via RxDB:', resetErr);

                // Fallback: Try native IndexedDB deletion (Nuclear Option)
                try {
                    console.warn('🧨 Attempting manual IndexedDB deletion fallback...');
                    await new Promise<void>((resolve, reject) => {
                        // @ts-ignore
                        const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                        if (!idb) throw new Error('IndexedDB not available');

                        const req = idb.deleteDatabase('kernel_db_v2');
                        req.onsuccess = () => resolve();
                        req.onerror = () => reject(req.error);
                        req.onblocked = () => console.warn('⚠️ Native deletion blocked. Close other tabs!');
                    });

                    console.log('✅ Manual deletion successful. Retrying init...');
                    db = await init();
                    console.log('✅ Database reset and recreated successfully (via native nuke).');
                } catch (finalErr) {
                    console.error('❌ CRITICAL: Native deletion also failed:', finalErr);
                    throw createRecoveryError('Database reset failed. Please manually clear your browser Application Storage (IndexedDB).');
                }
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

export const syncDatabase = async (db: KernelDatabase, user: { id: string, email: string }) => {
    console.log('🔄 Starting sync for user:', user.email);

    // Stop existing replications if any
    await stopReplication();

    // @ts-ignore
    const COUCHDB_URL = import.meta.env.VITE_COUCHDB_URL;
    if (!COUCHDB_URL) {
        console.warn('⚠️ VITE_COUCHDB_URL is not set. Replication skipped.');
        return;
    }

    // @ts-ignore
    const COUCHDB_USER = import.meta.env.VITE_COUCHDB_USER;
    // @ts-ignore
    const COUCHDB_PASSWORD = import.meta.env.VITE_COUCHDB_PASSWORD;

    // Use a user-specific prefix for isolation
    // Assuming backend provisions: userdb-{userId}-{collectionName}
    const userDbPrefix = `userdb-${user.id}-`;

    Object.entries(db.collections).forEach(([name, collection]) => {
        // Construct user-specific remote URL
        // e.g. http://localhost:5984/userdb-123-projects
        const remoteUrl = `${COUCHDB_URL}/${userDbPrefix}${name}`;

        console.log(`🔌 Syncing ${name} to ${remoteUrl}`);

        const replicationState = syncCollection(collection, remoteUrl, AuthService.getToken, {
            username: COUCHDB_USER,
            password: COUCHDB_PASSWORD
        });

        replicationStates.push(replicationState);
    });
};

export const stopReplication = async () => {
    if (replicationStates.length > 0) {
        console.log('🛑 Stopping active replications...');
        await Promise.all(replicationStates.map(state => state.cancel()));
        replicationStates.length = 0;
    }
};
