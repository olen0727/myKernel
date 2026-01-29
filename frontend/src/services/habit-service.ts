
import { BaseService } from './base-service';
import { Habit } from '../types/models';
import { KernelDatabase } from '../db/database';

export class HabitService extends BaseService<Habit> {
    constructor(db: KernelDatabase) {
        super(db, 'habits');
    }

    /**
     * Toggle habit completion for a specific date
     * Creates or deletes a Log entry
     */
    async toggleCompletion(habitId: string, date: string): Promise<boolean> {
        const log = await (this.db as any).logs.findOne({
            selector: {
                habitId,
                date
            }
        }).exec();

        if (log) {
            await log.remove();
            return false; // Removed (uncompleted)
        } else {
            const now = new Date().toISOString();
            await (this.db as any).logs.insert({
                id: crypto.randomUUID(),
                habitId,
                date,
                createdAt: now,
                updatedAt: now
            });
            return true; // Added (completed)
        }
    }

    /**
     * Get all completion dates for a habit
     */
    async getCompletions(habitId: string): Promise<string[]> {
        const logs = await (this.db as any).logs.find({ selector: { habitId } }).exec();
        return logs.map((l: any) => l.date);
    }
}
