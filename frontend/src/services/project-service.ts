
import { BaseService } from './base-service';
import { Project } from '../types/models';
import { KernelDatabase } from '../db/database';

export class ProjectService extends BaseService<Project> {
    constructor(db: KernelDatabase) {
        super(db, 'projects');
    }

    async recalculateProgress(projectId: string): Promise<void> {
        // Access tasks collection via db instance
        const tasks = await this.db.tasks.find({ selector: { projectId } }).exec();

        if (tasks.length === 0) {
            await this.update(projectId, { progress: 0 });
            return;
        }

        const completed = tasks.filter((t: any) => t.status === 'done').length;
        const progress = Math.round((completed / tasks.length) * 100);

        await this.update(projectId, { progress });
    }
}
