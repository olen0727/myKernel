
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { BaseService } from '../base-service';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { projectSchema } from '../../db/schemas/project.schema';
import { Project } from '../../types/models';
import { firstValueFrom } from 'rxjs';

/*
 * Concrete implementation for testing the abstract BaseService
 */
class TestProjectService extends BaseService<Project> {
    constructor(db: any) {
        super(db, 'projects');
    }
}

describe('BaseService', () => {
    let db: any;
    let service: TestProjectService;

    beforeAll(async () => {
        // Create in-memory DB for testing
        db = await createRxDatabase({
            name: 'test_db',
            storage: getRxStorageMemory()
        });

        await db.addCollections({
            projects: { schema: projectSchema }
        });
    });

    beforeEach(async () => {
        // Clear collection
        const existing = await db.projects.find().exec();
        // RxDB remove is on document
        await Promise.all(existing.map((doc: any) => doc.remove()));
        service = new TestProjectService(db);
    });

    it('should create and retrieve a document', async () => {
        const newProject = {
            name: 'Test Project',
            status: 'active' as const,
            progress: 0
        };

        const created = await service.create(newProject);
        expect(created.id).toBeDefined();
        expect(created.name).toBe('Test Project');
        expect(created.createdAt).toBeDefined();

        const fetched = await service.getById(created.id);
        expect(fetched?.id).toBe(created.id);
        expect(fetched?.name).toBe('Test Project');
    });

    it('should update a document', async () => {
        const created = await service.create({
            name: 'Original Name',
            status: 'active' as const,
            progress: 0
        });

        const updated = await service.update(created.id, { name: 'Updated Name' });
        expect(updated.name).toBe('Updated Name');

        const fetched = await service.getById(created.id);
        expect(fetched?.name).toBe('Updated Name');
    });

    it('should delete a document', async () => {
        const created = await service.create({
            name: 'To Delete',
            status: 'active' as const,
            progress: 0
        });

        await service.delete(created.id);
        const fetched = await service.getById(created.id);
        expect(fetched).toBeNull();
    });

    it('should return observable stream', async () => {
        const created = await service.create({
            name: 'Stream Test',
            status: 'active' as const,
            progress: 0
        });

        const stream$ = service.getById$(created.id);
        const value = await firstValueFrom(stream$);
        expect(value?.name).toBe('Stream Test');
    });
});
