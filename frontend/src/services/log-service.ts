
import { BaseService } from './base-service';
import { Log } from '../types/models';
import { KernelDatabase } from '../db/database';

export class LogService extends BaseService<Log> {
    constructor(db: KernelDatabase) {
        super(db, 'logs');
    }

    async getEntries(metricId: string): Promise<Log[]> {
        const docs = await this.collection.find({
            selector: {
                metricId
            }
        }).exec();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return docs.map((d: any) => d.toJSON() as Log);
    }
}
