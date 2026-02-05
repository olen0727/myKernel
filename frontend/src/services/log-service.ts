import { BaseService } from './base-service';
import { Log } from '../types/models';
import { KernelDatabase } from '../db/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

    getDailyNote$(date: string): Observable<Log | null> {
        return this.collection.findOne({
            selector: {
                date,
                action: 'daily_note'
            }
        }).$.pipe(
            map((doc: any) => doc ? (doc.toJSON() as Log) : null)
        );
    }
}
