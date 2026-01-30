
import { BaseService } from './base-service';
import { Task } from '../types/models';
import { KernelDatabase } from '../db/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class TaskService extends BaseService<Task> {
    constructor(db: KernelDatabase) {
        super(db, 'tasks');
    }

    getByProject$(projectId: string): Observable<Task[]> {
        return this.collection.find({
            selector: {
                projectId
            }
        }).$.pipe(
            map((docs: any[]) => docs.map((d: any) => d.toJSON() as Task))
        );
    }
}
