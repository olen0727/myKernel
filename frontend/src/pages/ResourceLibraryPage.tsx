import React, { useMemo, useState, useEffect } from "react"
import { FilterBar, FilterState } from "@/components/resources/FilterBar"
import { Resource as ComponentResource, ResourceItem, ResourceStatus } from "@/components/resources/ResourceItem"
import { ScrollArea } from "@/components/ui/scroll-area"
import { services, ResourceService, ProjectService, AreaService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { toast } from "sonner"
import { Resource, Project, Area } from "@/types/models"

const DEFAULT_FILTERS: FilterState = {
    search: "",
    status: "processed",
    project: "all",
    tags: []
}

export default function ResourceLibraryPage() {
    const [resourceService, setResourceService] = useState<ResourceService | undefined>();
    const [projectService, setProjectService] = useState<ProjectService | undefined>();
    const [areaService, setAreaService] = useState<AreaService | undefined>();

    useEffect(() => {
        const load = async () => {
            setResourceService(await services.resource);
            setProjectService(await services.project);
            setAreaService(await services.area);
        };
        load();
    }, []);

    const resources$ = useMemo(() => resourceService?.getAll$(), [resourceService]);
    const projects$ = useMemo(() => projectService?.getAll$(), [projectService]);
    const areas$ = useMemo(() => areaService?.getAll$(), [areaService]);

    const allResources = useObservable<Resource[]>(resources$, []) || [];
    const allProjects = useObservable<Project[]>(projects$, []) || [];
    const allAreas = useObservable<Area[]>(areas$, []) || [];

    const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS)

    // Map DB resources to Component resources
    const mappedResources = useMemo(() => {
        return allResources.map(r => {
            const linkedItems = [];
            if (r.projectId) {
                const p = allProjects.find(p => p.id === r.projectId);
                if (p) linkedItems.push({ id: p.id, name: p.name, type: 'project' as const });
            }
            if (r.areaId) {
                const a = allAreas.find(a => a.id === r.areaId);
                if (a) linkedItems.push({ id: a.id, name: a.name, type: 'area' as const });
            }

            // Infer status if missing
            let status = r.status as ResourceStatus;
            if (!status) {
                if (!r.projectId && !r.areaId) status = 'inbox';
                else status = 'processed';
            }

            return {
                id: r.id,
                type: (r.type === 'document' ? 'note' : r.type) as 'note' | 'link', // Adapt if document type not supported by Item
                title: r.title,
                summary: r.content || '',
                timestamp: new Date(r.createdAt || Date.now()),
                url: r.url,
                status: status,
                tags: r.tags || [],
                linkedItems: linkedItems
            } as ComponentResource;
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [allResources, allProjects, allAreas]);

    // H1: Filter resources based on filter state
    const filteredResources = useMemo(() => {
        return mappedResources.filter(resource => {
            const resourceStatus = resource.status ?? "inbox"
            const resourceTags = resource.tags ?? []
            const resourceLinkedItems = resource.linkedItems ?? []

            // Status filter
            if (filters.status !== "all" && resourceStatus !== filters.status) {
                return false
            }

            // Search filter (title and summary)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesSearch =
                    resource.title.toLowerCase().includes(searchLower) ||
                    resource.summary.toLowerCase().includes(searchLower)
                if (!matchesSearch) return false
            }

            // Project filter
            if (filters.project !== "all") {
                const hasProject = resourceLinkedItems.some(
                    item => item.type === "project" && item.id === filters.project
                )
                if (!hasProject) return false
            }

            // Tags filter (multi-select: resource must have ALL selected tags)
            if (filters.tags.length > 0) {
                const hasAllTags = filters.tags.every(tag => resourceTags.includes(tag))
                if (!hasAllTags) return false
            }

            return true
        })
    }, [mappedResources, filters])

    const handleArchive = async (id: string) => {
        if (!resourceService) return;
        try {
            await resourceService.update(id, { status: 'archived' });
            toast.success("資源已封存");
        } catch (e) {
            toast.error("操作失敗");
        }
    }

    const handleDelete = async (id: string) => {
        if (!resourceService) return;
        try {
            await resourceService.delete(id);
            toast.success("資源已刪除");
        } catch (e) {
            toast.error("操作失敗");
        }
    }

    const handleStatusChange = async (id: string, status: "inbox" | "processed" | "archived") => {
        if (!resourceService) return;
        try {
            await resourceService.update(id, { status });
            toast.success("狀態已更新");
        } catch (e) {
            toast.error("操作失敗");
        }
    }

    // Extract unique tags from resources for filter options
    const availableTags = useMemo(() => {
        const tagSet = new Set<string>()
        mappedResources.forEach(r => (r.tags ?? []).forEach(t => tagSet.add(t)))
        return Array.from(tagSet).sort()
    }, [mappedResources])

    // Extract unique projects from resources
    const availableProjects = useMemo(() => {
        const projectMap = new Map<string, string>()
        projectMap.set("all", "所有專案")
        allProjects.forEach(p => {
            projectMap.set(p.id, p.name);
        });
        return Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }))
    }, [allProjects])

    if (!resourceService || !projectService || !areaService) {
        return <div className="h-full flex items-center justify-center">Loading Library...</div>
    }

    return (
        <div className="flex flex-col gap-6 h-full p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold tracking-tight">資源庫 Resource Library</h1>
                <p className="text-muted-foreground">已處理與歸檔的知識庫 Your knowledge assets.</p>
            </div>

            <FilterBar
                filters={filters}
                onFiltersChange={setFilters}
                availableTags={availableTags}
                availableProjects={availableProjects}
            />

            <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="flex flex-col gap-3 pb-8">
                    {filteredResources.map(resource => (
                        <ResourceItem
                            key={resource.id}
                            resource={resource}
                            onArchive={handleArchive}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                    {filteredResources.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            沒有符合的資源 No resources found.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
