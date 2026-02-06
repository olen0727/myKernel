
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { AreaService } from '../area-service';
import { ProjectService } from '../project-service';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { areaSchema } from '../../db/schemas/area.schema';
import { projectSchema } from '../../db/schemas/project.schema';
import { taskSchema } from '../../db/schemas/task.schema';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { addRxPlugin } from 'rxdb';

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

describe('Cascade Deletion Integration', () => {
    let db: any;
    let areaService: AreaService;
    let projectService: ProjectService;

    beforeAll(async () => {
        db = await createRxDatabase({
            name: 'test_cascade_db',
            storage: getRxStorageMemory(),
            ignoreDuplicate: true
        });
        await db.addCollections({
            areas: { schema: areaSchema },
            projects: { schema: projectSchema },
            tasks: { schema: taskSchema }
        });
    });

    beforeEach(async () => {
        const collections = ['areas', 'projects', 'tasks'];
        for (const colName of collections) {
            const docs = await db[colName].find().exec();
            await Promise.all(docs.map((d: any) => d.remove()));
        }

        areaService = new AreaService(db);
        projectService = new ProjectService(db);
    });

    it('should delete project and tasks when area is deleted', async () => {
        // 1. Create Area
        const area = await areaService.create({ name: 'Test Area', status: 'active' });

        // 2. Create Project in Area
        const project = await db.projects.insert({
            id: 'p1',
            name: 'Test Project',
            areaId: area.id,
            status: 'active',
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 3. Create Tasks in Project
        await db.tasks.insert({
            id: 't1',
            title: 'Task 1',
            projectId: project.id,
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 4. Verify Cascade Info
        const info = await areaService.getCascadeInfo(area.id);
        expect(info.projectCount).toBe(1);
        expect(info.taskCount).toBe(1);

        // 5. Delete Area
        await areaService.delete(area.id);

        // 6. Verify Deletion
        const areaFound = await areaService.getById(area.id);
        const projectFound = await db.projects.findOne(project.id).exec();
        const taskFound = await db.tasks.findOne('t1').exec();

        expect(areaFound).toBeNull();
        expect(projectFound).toBeNull();
        expect(taskFound).toBeNull();
    });

    it('should delete tasks when project is deleted', async () => {
        // 1. Create Project
        const project = await db.projects.insert({
            id: 'p2',
            name: 'Test Project 2',
            areaId: 'some-area',
            status: 'active',
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 2. Create Tasks
        await db.tasks.insert({
            id: 't2',
            title: 'Task 2',
            projectId: project.id,
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 3. Verify Cascade Info
        const info = await projectService.getCascadeInfo(project.id);
        expect(info.taskCount).toBe(1);

        // 4. Delete Project
        await projectService.delete(project.id);

        // 5. Verify
        const projectFound = await db.projects.findOne(project.id).exec();
        const taskFound = await db.tasks.findOne('t2').exec();

        expect(projectFound).toBeNull();
        expect(taskFound).toBeNull();
    });
});
