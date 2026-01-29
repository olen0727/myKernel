import { RxJsonSchema } from 'rxdb';

export const habitSchema: RxJsonSchema<any> = {
    title: 'habit schema',
    version: 0,
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
