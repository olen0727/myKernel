
import { BaseService } from './base-service';
import { Task } from '../types/models';
import { KernelDatabase } from '../db/database';

export class TaskService extends BaseService<Task> {
    constructor(db: KernelDatabase) {
        super(db, 'tasks');
    }
}
