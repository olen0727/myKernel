import { RxJsonSchema } from 'rxdb';

export const taskSchema: RxJsonSchema<any> = {
    title: 'task schema',
    version: 3,
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
        status: {
            type: 'string',
            enum: ['todo', 'doing', 'done', 'checked'],
            default: 'todo'
        },
        projectId: {
            type: 'string'
        },
        urgency: {
            type: ['string', 'null'],
            enum: ['orange', 'red', null]
        },
        tomatoes: {
            type: 'number',
            minimum: 1,
            maximum: 5,
            default: 1
        },
        order: {
            type: 'number',
            default: 0
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
