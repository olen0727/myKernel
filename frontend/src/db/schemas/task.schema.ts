import { RxJsonSchema } from 'rxdb';

export const taskSchema: RxJsonSchema<any> = {
    title: 'task schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        title: {
            type: 'string'
        },
        completed: {
            type: 'boolean',
            default: false
        },
        projectId: {
            type: 'string'
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
    required: ['id', 'title', 'createdAt']
};
