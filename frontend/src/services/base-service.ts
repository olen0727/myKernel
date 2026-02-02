
import { KernelDatabase } from '../db/database';
import { BaseModel } from '../types/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class BaseService<T extends BaseModel> {
    constructor(
        protected db: KernelDatabase,
        protected collectionName: string
    ) { }

    protected get collection() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (this.db as any)[this.collectionName];
    }

    /**
     * Create a new document
     */
    async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<BaseModel>): Promise<T> {
        const now = new Date().toISOString();
        const id = data.id || crypto.randomUUID();

        const doc = await this.collection.insert({
            ...data,
            id,
            createdAt: now,
            updatedAt: now
        } as any);
        return doc.toJSON() as T;
    }

    /**
     * Update an existing document
     */
    async update(id: string, data: Partial<T>): Promise<T> {
        const doc = await this.collection.findOne(id).exec();
        if (!doc) throw new Error(`Document with id ${id} not found in ${this.collectionName}`);

        // Use incrementalModify to handle conflict errors automatically
        // This retries the update function if the document has changed since read
        const newDoc = await doc.incrementalModify((oldData: any) => {
            return {
                ...oldData,
                ...data,
                updatedAt: new Date().toISOString()
            };
        });

        return newDoc.toJSON() as T;
    }

    /**
     * Delete a document
     */
    async delete(id: string): Promise<void> {
        const doc = await this.collection.findOne(id).exec();
        if (doc) {
            await doc.remove();
        }
    }

    /**
     * Get document by ID
     */
    async getById(id: string): Promise<T | null> {
        const doc = await this.collection.findOne(id).exec();
        return doc ? (doc.toJSON() as T) : null;
    }

    /**
     * Get document observable by ID
     */
    getById$(id: string): Observable<T | null> {
        return this.collection.findOne(id).$.pipe(
            map((doc: any) => doc ? (doc.toJSON() as T) : null)
        );
    }

    /**
     * Get all documents
     */
    async getAll(): Promise<T[]> {
        const docs = await this.collection.find().exec();
        return docs.map((d: any) => d.toJSON() as T);
    }

    /**
     * Get all documents observable
     */
    getAll$(): Observable<T[]> {
        return this.collection.find().$.pipe(
            map((docs: any[]) => docs.map((d: any) => d.toJSON() as T))
        );
    }
}
