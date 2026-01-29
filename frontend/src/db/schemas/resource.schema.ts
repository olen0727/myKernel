import { RxJsonSchema } from 'rxdb';

export const resourceSchema: RxJsonSchema<any> = {
    title: 'resource schema',
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
        type: {
            type: 'string', // e.g., 'link', 'note', 'document'
            default: 'note'
        },
        url: {
            type: 'string'
        },
        content: {
            type: 'string',
            // TODO: [Story 6.3] Enable encryption when password handling is implemented
            // encrypted: true 
        },
        context: {
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
