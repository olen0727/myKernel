import { services } from '../services';
import {
    INITIAL_AREAS,
    INITIAL_PROJECTS,
    HABITS,
    INITIAL_INBOX_RESOURCES,
    METRIC_DEFINITIONS,
    INITIAL_PROJECT_RESOURCES
} from '../services/mock-data-service';

export class DataSeeder {
    static async seed() {
        console.log('Starting Data Seeding Process...');

        try {
            // Helper to ignore conflicts
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const safeCreate = async (service: any, data: any) => {
                try {
                    await service.create(data);
                } catch (err: any) {
                    if (err?.code === 'CONFLICT' || err?.message?.includes('conflict')) {
                        console.log(`Skipping duplicate seed data: ${data.name || data.title || data.id}`);
                    } else {
                        throw err;
                    }
                }
            };

            // Areas
            const areaService = await services.area;
            const areas = await areaService.getAll();
            if (areas.length === 0) {
                console.log('Seeding Areas...');
                for (const area of INITIAL_AREAS) {
                    await safeCreate(areaService, { ...area });
                }
            }

            // Projects
            const projectService = await services.project;
            const projects = await projectService.getAll();
            if (projects.length === 0) {
                console.log('Seeding Projects...');
                for (const project of INITIAL_PROJECTS) {
                    await safeCreate(projectService, {
                        ...project,
                        // @ts-ignore
                        dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
                        createdAt: new Date().toISOString(),
                    });
                }
            }

            // Habits
            const habitService = await services.habit;
            const habits = await habitService.getAll();
            if (habits.length === 0) {
                console.log('Seeding Habits...');
                for (const habit of HABITS) {
                    await safeCreate(habitService, { ...habit });
                }
            }

            // Resources
            const resourceService = await services.resource;
            const resources = await resourceService.getAll();
            if (resources.length === 0) {
                console.log('Seeding Resources...');
                for (const res of INITIAL_INBOX_RESOURCES) {
                    await safeCreate(resourceService, {
                        ...res,
                        timestamp: res.timestamp.toISOString(),
                        createdAt: res.timestamp ? res.timestamp.toISOString() : new Date().toISOString(),
                    });
                }
                for (const res of INITIAL_PROJECT_RESOURCES) {
                    await safeCreate(resourceService, {
                        ...res,
                        createdAt: res.createdAt ? res.createdAt.toISOString() : new Date().toISOString(),
                    });
                }
            }

            // Metrics
            const metricService = await services.metric;
            const metrics = await metricService.getAll();
            if (metrics.length === 0) {
                console.log('Seeding Metrics...');
                for (const metric of METRIC_DEFINITIONS) {
                    await safeCreate(metricService, { ...metric });
                }
            }

            console.log('Data Seeding Completed.');
        } catch (error) {
            console.error('Data Seeding Failed:', error);
        }
    }
}
