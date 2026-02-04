import { RxJsonSchema } from 'rxdb';

export const logSchema: RxJsonSchema<any> = {
    title: 'log schema',
    version: 2,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        date: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}'
        },
        action: {
            type: 'string'
        },
        value: {
            type: 'string' // Store value as string to be flexible or specific types? Keeping versatile.
        },
        metricId: {
            type: 'string'
        },
        habitId: {
            type: 'string'
        },
        details: {
            type: 'string'
        },
        timestamp: {
            type: 'number'
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
    required: ['id', 'date', 'createdAt']
};
