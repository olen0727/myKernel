
import { BaseService } from './base-service';
import { Log } from '../types/models';
import { KernelDatabase } from '../db/database';

export class LogService extends BaseService<Log> {
    constructor(db: KernelDatabase) {
        super(db, 'logs');
    }
}
