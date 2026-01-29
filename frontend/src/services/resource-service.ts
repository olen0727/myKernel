
import { BaseService } from './base-service';
import { Resource } from '../types/models';
import { KernelDatabase } from '../db/database';

export class ResourceService extends BaseService<Resource> {
    constructor(db: KernelDatabase) {
        super(db, 'resources');
    }
}
