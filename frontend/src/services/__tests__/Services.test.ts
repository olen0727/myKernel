
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ProjectService } from '../project-service';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { projectSchema } from '../../db/schemas/project.schema';
import { taskSchema } from '../../db/schemas/task.schema';

describe('ProjectService Integration', () => {
    let db: any;
    let service: ProjectService;

    beforeAll(async () => {
        db = await createRxDatabase({
            name: 'test_services_db',
            storage: getRxStorageMemory(),
            ignoreDuplicate: true
        });
        await db.addCollections({
            projects: { schema: projectSchema },
            tasks: { schema: taskSchema }
        });
    });

    beforeEach(async () => {
        // Clear collections logic
        const collections = ['projects', 'tasks'];
        for (const colName of collections) {
            const docs = await db[colName].find().exec();
            await Promise.all(docs.map((d: any) => d.remove()));
        }

        service = new ProjectService(db);
    });

    it('should recalculate progress based on task completion', async () => {
        // 1. Create Project
        const project = await service.create({
            name: 'Progress Project',
            status: 'active',
            progress: 0
        });

        // 2. Create Tasks via DB
        const now = new Date().toISOString();
        const taskId1 = 't1';
        const taskId2 = 't2';

        await db.tasks.insert({
            id: taskId1,
            title: 'Task 1',
            completed: true,
            projectId: project.id,
            createdAt: now,
            updatedAt: now
        });

        await db.tasks.insert({
            id: taskId2,
            title: 'Task 2',
            completed: false, // 1/2 completed = 50%
            projectId: project.id,
            createdAt: now,
            updatedAt: now
        });

        // 3. Recalculate
        await service.recalculateProgress(project.id);

        // 4. Verify
        const updated = await service.getById(project.id);
        expect(updated?.progress).toBe(50);

        // 5. Complete task 2
        const t2 = await db.tasks.findOne(taskId2).exec();
        await t2.patch({ completed: true });

        await service.recalculateProgress(project.id);
        const updated2 = await service.getById(project.id);
        expect(updated2?.progress).toBe(100);
    });
});
