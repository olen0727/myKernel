import React, { useMemo } from "react"
import { FilterBar, FilterState } from "@/components/resources/FilterBar"
import { Resource, ResourceItem } from "@/components/resources/ResourceItem"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data with full Resource type
const MOCK_RESOURCES: Resource[] = [
    {
        id: "1",
        type: "note",
        title: "Kernel Architecture Design",
        summary: "Detailed architecture notes for the Kernel project, including frontend and backend separation.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "processed",
        tags: ["architecture", "design"],
        linkedItems: [
            { id: "p1", name: "Kernel Development", type: "project" }
        ]
    },
    {
        id: "2",
        type: "link",
        title: "React Documentation",
        summary: "Official React documentation for hooks and components.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        url: "https://react.dev",
        status: "processed",
        tags: ["react", "frontend"],
        linkedItems: []
    },
    {
        id: "3",
        type: "note",
        title: "Meeting Notes - Sprint Planning",
        summary: "Sprint planning notes from yesterday's meeting with the team.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        status: "inbox",
        tags: [],
        linkedItems: []
    },
    {
        id: "4",
        type: "link",
        title: "Old Tutorial - Deprecated",
        summary: "This tutorial is no longer relevant, kept for reference only.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
        url: "https://old-tutorial.com",
        status: "archived",
        tags: ["backend"],
        linkedItems: [
            { id: "a1", name: "Work", type: "area" }
        ]
    }
]

const DEFAULT_FILTERS: FilterState = {
    search: "",
    status: "processed",
    project: "all",
    tags: []
}

export default function ResourceLibraryPage() {
    const [resources, setResources] = React.useState<Resource[]>(MOCK_RESOURCES)
    const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS)

    // H1: Filter resources based on filter state
    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
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
    }, [resources, filters])

    const handleArchive = (id: string) => {
        setResources(prev => prev.map(r =>
            r.id === id ? { ...r, status: "archived" as const } : r
        ))
    }

    const handleDelete = (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id))
    }

    const handleStatusChange = (id: string, status: "inbox" | "processed" | "archived") => {
        setResources(prev => prev.map(r =>
            r.id === id ? { ...r, status } : r
        ))
    }

    // Extract unique tags from resources for filter options
    const availableTags = useMemo(() => {
        const tagSet = new Set<string>()
        resources.forEach(r => (r.tags ?? []).forEach(t => tagSet.add(t)))
        return Array.from(tagSet).sort()
    }, [resources])

    // Extract unique projects from resources
    const availableProjects = useMemo(() => {
        const projectMap = new Map<string, string>()
        projectMap.set("all", "所有專案")
        resources.forEach(r => {
            (r.linkedItems ?? [])
                .filter(item => item.type === "project")
                .forEach(item => projectMap.set(item.id, item.name))
        })
        return Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }))
    }, [resources])

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
