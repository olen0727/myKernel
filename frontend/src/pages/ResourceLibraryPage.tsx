import React from "react"
import { FilterBar } from "@/components/resources/FilterBar"
import { Resource, ResourceItem } from "@/components/resources/ResourceItem"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data
const MOCK_RESOURCES: Resource[] = [
    {
        id: "1",
        type: "note",
        title: "Kernel Architecture Design",
        summary: "Detailed architecture notes for the Kernel project, including frontend and backend separation.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
        id: "2",
        type: "link",
        title: "React Documentation",
        summary: "Official React documentation for hooks and components.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        url: "https://react.dev"
    }
]

export default function ResourceLibraryPage() {
    const [resources, setResources] = React.useState<Resource[]>(MOCK_RESOURCES)

    const handleArchive = (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id))
    }

    const handleDelete = (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id))
    }

    return (
        <div className="flex flex-col gap-6 h-full p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold tracking-tight">資源庫 Resource Library</h1>
                <p className="text-muted-foreground">已處理與歸檔的知識庫 Your knowledge assets.</p>
            </div>

            <FilterBar />

            <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="flex flex-col gap-3 pb-8">
                    {resources.map(resource => (
                        <ResourceItem
                            key={resource.id}
                            resource={resource}
                            onArchive={handleArchive}
                            onDelete={handleDelete}
                        />
                    ))}
                    {resources.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            沒有符合的資源 No resources found.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
