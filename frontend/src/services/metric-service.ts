
import { BaseService } from './base-service';
import { Metric, Log } from '../types/models';
import { KernelDatabase } from '../db/database';

export class MetricService extends BaseService<Metric> {
    constructor(db: KernelDatabase) {
        super(db, 'metrics');
    }

    /**
     * Add or update a metric value for a date
     */
    async addEntry(metricId: string, value: string, date: string): Promise<Log> {
        const existing = await (this.db as any).logs.findOne({ selector: { metricId, date } }).exec();
        if (existing) {
            const updated = await existing.patch({
                value,
                updatedAt: new Date().toISOString()
            });
            return updated.toJSON() as Log;
        }

        const now = new Date().toISOString();
        const newLog = await (this.db as any).logs.insert({
            id: crypto.randomUUID(),
            metricId,
            date,
            value,
            createdAt: now,
            updatedAt: now
        });
        return newLog.toJSON() as Log;
    }

    /**
     * Get all entries for a metric
     */
    async getEntries(metricId: string): Promise<Log[]> {
        const logs = await (this.db as any).logs.find({ selector: { metricId } }).exec();
        return logs.map((l: any) => l.toJSON() as Log);
    }
}
