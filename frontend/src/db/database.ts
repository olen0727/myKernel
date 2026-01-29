import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
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

const createDatabase = async (): Promise<KernelDatabase> => {
    console.log('Initializing RxDB...');

    const db = await createRxDatabase({
        name: 'kernel_db',
        storage: getRxStorageDexie(),
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

export const getDatabase = () => {
    if (!dbPromise) {
        dbPromise = createDatabase();
    }
    return dbPromise;
};
