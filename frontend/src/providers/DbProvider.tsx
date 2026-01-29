import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RxDatabase } from 'rxdb';
import { getDatabase } from '../db/database';
import { Loader2 } from 'lucide-react';

const DbContext = createContext<RxDatabase | null>(null);

interface DbProviderProps {
    children: ReactNode;
}

export const DbProvider = ({ children }: DbProviderProps) => {
    const [db, setDb] = useState<RxDatabase | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const _db = await getDatabase();
                setDb(_db);
            } catch (err) {
                console.error("Failed to initialize database:", err);
                setError(err instanceof Error ? err : new Error('Unknown DB Error'));
            }
        };
        init();
    }, []);

    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center flex-col gap-4 text-red-500">
                <div>Database Initialization Failed</div>
                <div className="text-sm text-gray-500">{error.message}</div>
            </div>
        );
    }

    if (!db) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Initializing System...</span>
            </div>
        );
    }

    return (
        <DbContext.Provider value={db}>
            {children}
        </DbContext.Provider>
    );
};

export const useDb = () => {
    const context = useContext(DbContext);
    if (!context) {
        throw new Error("useDb must be used within a DbProvider");
    }
    return context;
};
