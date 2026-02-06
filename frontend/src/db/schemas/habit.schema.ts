import { RxJsonSchema } from 'rxdb';

export const habitSchema: RxJsonSchema<any> = {
    title: 'habit schema',
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
        frequency: {
            type: 'string', // e.g., 'daily', 'weekly'
            default: 'daily'
        },
        completedDates: {
            type: 'array',
            items: {
                type: 'string'
            },
            default: []
        },
        areaId: {
            type: 'string'
        },
        status: {
            type: 'string',
            enum: ['active', 'paused', 'archived'],
            default: 'active'
        },
        currentStreak: {
            type: 'number',
            default: 0
        },
        maxStreak: {
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
    required: ['id', 'name', 'createdAt']
};
