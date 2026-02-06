
import { BaseService } from './base-service';
import { Area } from '../types/models';
import { KernelDatabase } from '../db/database';

export class AreaService extends BaseService<Area> {
    constructor(db: KernelDatabase) {
        super(db, 'areas');
    }
    async getCascadeInfo(id: string): Promise<{ projectCount: number, taskCount: number }> {
        const projects = await this.db.projects.find({ selector: { areaId: id } }).exec();
        const projectIds = projects.map(p => p.id);

        // Find tasks for all these projects
        let taskCount = 0;
        if (projectIds.length > 0) {
            const tasks = await this.db.tasks.find({
                selector: {
                    projectId: { $in: projectIds }
                }
            }).exec();
            taskCount = tasks.length;
        }

        return {
            projectCount: projects.length,
            taskCount
        };
    }

    async delete(id: string): Promise<void> {
        // 1. Get all projects in this area
        const projects = await this.db.projects.find({ selector: { areaId: id } }).exec();
        const projectIds = projects.map(p => p.id);

        // 2. Delete all tasks in these projects
        if (projectIds.length > 0) {
            const tasks = await this.db.tasks.find({
                selector: {
                    projectId: { $in: projectIds }
                }
            }).exec();
            await Promise.all(tasks.map((t: any) => t.remove()));
        }

        // 3. Delete all projects
        await Promise.all(projects.map((p: any) => p.remove()));

        // 4. Delete the area itself
        await super.delete(id);
    }
}
