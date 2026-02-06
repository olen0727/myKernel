
import { useState, useEffect, useMemo } from 'react';
import { services, ProjectService, AreaService } from '@/services';
import { useObservable } from './use-observable';
import { Project, Area } from '@/types/models';
import { Layout, Layers } from 'lucide-react';

export type RecentItem = {
    id: string;
    label: string;
    type: 'Project' | 'Area';
    icon: any;
    href: string;
    updatedAt: string;
};

export function useRecents(limit: number = 5) {
    const [projectService, setProjectService] = useState<ProjectService | undefined>();
    const [areaService, setAreaService] = useState<AreaService | undefined>();

    useEffect(() => {
        const load = async () => {
            setProjectService(await services.project);
            setAreaService(await services.area);
        };
        load();
    }, []);

    const projects$ = useMemo(() => projectService?.getAll$(), [projectService]);
    const areas$ = useMemo(() => areaService?.getAll$(), [areaService]);

    const projects = useObservable<Project[]>(projects$, []) || [];
    const areas = useObservable<Area[]>(areas$, []) || [];

    const recentItems: RecentItem[] = useMemo(() => {
        const pItems: RecentItem[] = projects.map(p => ({
            id: p.id,
            label: p.name,
            type: 'Project',
            icon: Layout,
            href: `/projects/${p.id}`,
            updatedAt: p.updatedAt || p.createdAt || ''
        }));

        const aItems: RecentItem[] = areas.map(a => ({
            id: a.id,
            label: a.name,
            type: 'Area',
            icon: Layers,
            href: `/areas/${a.id}`,
            updatedAt: a.updatedAt || a.createdAt || ''
        }));

        const all = [...pItems, ...aItems];

        // Sort distinct by ID to avoid duplicates if any logic error, 
        // but mainly sort by updatedAt desc
        return all
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, limit);

    }, [projects, areas, limit]);

    return recentItems;
}
