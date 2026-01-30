import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataSeeder } from '../data-seeder';
import { services } from '../index';

// Mock the services module
vi.mock('../index', () => {
    const mockProjectService = {
        getAll: vi.fn(),
        create: vi.fn().mockResolvedValue({ id: 'p1' }),
    };
    const mockTaskService = {
        create: vi.fn(),
    };
    return {
        services: {
            project: Promise.resolve(mockProjectService),
            task: Promise.resolve(mockTaskService),
        }
    };
});

describe('DataSeeder', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should seed data when no projects exist', async () => {
        const projectService = await services.project;
        (projectService.getAll as any).mockResolvedValue([]);

        const seeder = new DataSeeder();
        await seeder.seed();

        expect(projectService.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Demo Project'
        }));

        const taskService = await services.task;
        expect(taskService.create).toHaveBeenCalledTimes(2);
    });

    it('should NOT seed data when projects exist', async () => {
        const projectService = await services.project;
        (projectService.getAll as any).mockResolvedValue([{ id: 'existing' }]);

        const seeder = new DataSeeder();
        await seeder.seed();

        expect(projectService.create).not.toHaveBeenCalled();
    });
});
