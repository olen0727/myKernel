
import { getDatabase } from '../db/database';
import { ProjectService } from './project-service';
import { ResourceService } from './resource-service';
import { TaskService } from './task-service';
import { HabitService } from './habit-service';
import { MetricService } from './metric-service';
import { LogService } from './log-service';
import { AreaService } from './area-service';

export * from './base-service';
export * from './project-service';
export * from './resource-service';
export * from './task-service';
export * from './habit-service';
export * from './metric-service';
export * from './log-service';
export * from './area-service';

class ServiceFactory {
    private static instance: ServiceFactory;

    private constructor() { }

    public static getInstance(): ServiceFactory {
        if (!ServiceFactory.instance) {
            ServiceFactory.instance = new ServiceFactory();
        }
        return ServiceFactory.instance;
    }

    public async getDb() {
        return await getDatabase();
    }

    // Lazy getters that return Promises resolving to the Service instance
    get project() { return this.getDb().then(db => new ProjectService(db)); }
    get resource() { return this.getDb().then(db => new ResourceService(db)); }
    get task() { return this.getDb().then(db => new TaskService(db)); }
    get habit() { return this.getDb().then(db => new HabitService(db)); }
    get metric() { return this.getDb().then(db => new MetricService(db)); }
    get log() { return this.getDb().then(db => new LogService(db)); }
    get area() { return this.getDb().then(db => new AreaService(db)); }
}

export const services = ServiceFactory.getInstance();
