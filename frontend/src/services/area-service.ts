
import { BaseService } from './base-service';
import { Area } from '../types/models';
import { KernelDatabase } from '../db/database';

export class AreaService extends BaseService<Area> {
    constructor(db: KernelDatabase) {
        super(db, 'areas');
    }
}
