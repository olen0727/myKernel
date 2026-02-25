import { RxJsonSchema } from 'rxdb';

export const projectSchema: RxJsonSchema<any> = {
    title: 'project schema',
    version: 1,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        status: {
            type: 'string',
            enum: ['active', 'paused', 'completed', 'archived'],
            default: 'active'
        },
        progress: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            default: 0
        },
        areaId: {
            type: 'string'
        },
        taskLists: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    order: { type: 'number' }
                },
                required: ['id', 'title']
            }
        },
        createdAt: {
            type: 'string',
            format: 'date-time'
        },
        updatedAt: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['id', 'name', 'createdAt']
};
