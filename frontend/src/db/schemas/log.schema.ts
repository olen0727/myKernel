import { RxJsonSchema } from 'rxdb';

export const logSchema: RxJsonSchema<any> = {
    title: 'log schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        date: {
            type: 'string',
            format: 'date-time'
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
