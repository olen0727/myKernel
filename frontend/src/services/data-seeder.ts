
import { services } from './index';

export class DataSeeder {
    async seed() {
        console.log('Checking if seeding is needed...');
        try {
            const projectService = await services.project;
            const projects = await projectService.getAll();

            if (projects.length === 0) {
                console.log('No projects found. Seeding initial data...');

                // Create Demo Project
                const p1 = await projectService.create({
                    name: 'Demo Project',
                    description: 'A starter project to get you going.',
                    status: 'active',
                    progress: 0,
                });

                const taskService = await services.task;
                await taskService.create({
                    title: 'Check out the new Dashboard',
                    projectId: p1.id,
                    completed: false,
                });

                await taskService.create({
                    title: 'Create your first real project',
                    projectId: p1.id,
                    completed: false,
                });

                console.log('Seeding complete.');
            } else {
                console.log('Projects exist. Skipping seed.');
            }
        } catch (error) {
            console.error('Failed to seed data:', error);
        }
    }
}
