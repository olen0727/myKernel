
import { useState, useEffect, useMemo } from 'react';
import { services, ResourceService } from '@/services';
import { useObservable } from './use-observable';
import { Resource } from '@/types/models';

export function useInbox() {
    const [resourceService, setResourceService] = useState<ResourceService | undefined>();

    useEffect(() => {
        const load = async () => {
            setResourceService(await services.resource);
        };
        load();
    }, []);

    const resources$ = useMemo(() => resourceService?.getAll$(), [resourceService]);
    const allResources = useObservable<Resource[]>(resources$, []) || [];

    const inboxResources = useMemo(() => {
        return allResources.filter(r => {
            const isArchived = r.status === 'archived';
            const isProcessed = r.status === 'processed' || (r.projectIds?.length || r.areaIds?.length);
            return !isArchived && !isProcessed;
        }).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }, [allResources]);

    return {
        resources: inboxResources,
        count: inboxResources.length,
        isLoading: !resourceService
    };
}
