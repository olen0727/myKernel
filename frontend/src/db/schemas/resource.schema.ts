import { RxJsonSchema } from 'rxdb';

export const resourceSchema: RxJsonSchema<any> = {
    title: 'resource schema',
    version: 1,
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
            // Encryption enabled via top-level 'encrypted' array 
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
        },
        projectIds: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        areaIds: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        status: {
            type: 'string',
            enum: ['inbox', 'processed', 'archived']
        },
        tags: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    },
    required: ['id', 'title', 'createdAt']
};
