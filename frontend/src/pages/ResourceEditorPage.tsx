import { useParams, useNavigate } from "react-router-dom"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { ResourceSidebar, ResourceSidebarStatus } from "@/components/resources/ResourceSidebar"
import { DispatchItem } from "@/components/resources/DispatchModal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Cloud, CheckCircle2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { services, ResourceService } from "@/services"
import { Resource } from "@/types/models"

// Helper to adapt DB Resource to UI format
interface ResourceData {
    id: string
    title: string
    content: string
    status: ResourceSidebarStatus
    tags: string[]
    sourceUrl?: string
    linkedItems: DispatchItem[]
}

export default function ResourceEditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState<ResourceData | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Service Instance
    const [resourceService, setResourceService] = useState<ResourceService | null>(null)

    // Initialize Service
    useEffect(() => {
        const init = async () => {
            const svc = await services.resource
            setResourceService(svc)
        }
        init()
    }, [])

    // Load Data
    useEffect(() => {
        const loadResource = async () => {
            if (!id || !resourceService) return

            try {
                setIsLoading(true)
                const resource = await resourceService.getById(id)

                if (!resource) {
                    toast.error("Resource not found")
                    navigate("/inbox")
                    return
                }



                // Fetch linked project/area names if needed (Skipping for MVP speed, using IDs as names temporarily or empty)
                // In a real app we would join efficiently. Here we construct LinkedItems from projectId/areaId.
                const linkedItems: DispatchItem[] = []
                if (resource.projectId) {
                    // Ideally fetch project name. For now let's hope we can optimize later.
                    // We'll leave the name generic or empty if we don't fetch it, 
                    // but to show it in UI we might need a separate fetch.
                    // Let's do a quick hack: if connected, show generic badge until we load names.
                    linkedItems.push({ id: resource.projectId, name: "Project", type: "project" })
                }
                if (resource.areaId) {
                    linkedItems.push({ id: resource.areaId, name: "Area", type: "area" })
                }

                // If we really want names, we can fetch them here. 
                // Let's keep it simple: Render now.

                setData({
                    id: resource.id,
                    title: resource.title,
                    content: resource.content || "",
                    status: (resource.status as ResourceSidebarStatus) || "inbox",
                    tags: resource.tags || [],
                    sourceUrl: resource.url,
                    linkedItems
                })
            } catch (err) {
                console.error(err)
                toast.error("Failed to load resource")
            } finally {
                setIsLoading(false)
            }
        }

        loadResource()
    }, [id, resourceService, navigate])


    // Generic Update Handler
    const updateResource = useCallback(async (updates: Partial<Resource>) => {
        if (!id || !resourceService) return

        setIsSaving(true)
        try {
            await resourceService.update(id, updates)
            setLastSaved(new Date())

            // Update local state to match

        } catch (err) {
            console.error(err)
            toast.error("Failed to save changes")
        } finally {
            setIsSaving(false)
        }
    }, [id, resourceService])


    const handleContentChange = (newContent: string) => {
        // Optimistic UI update for editor is handled by TipTap, 
        // we just sync to DB state on debounce or blur.
        // For simplicity here we assume 'onChange' is debounced or we accept frequent writes (RxDB handles it well)
        // But better to debounce at component level if TipTap triggers on every keystroke.
        // TipTapEditor usually triggers onChange.

        setData(prev => prev ? { ...prev, content: newContent } : null)

        // Debounced Save (simplistic)
        const timer = setTimeout(() => {
            updateResource({ content: newContent })
        }, 1000)
        return () => clearTimeout(timer)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setData(prev => prev ? { ...prev, title: val } : null)

        // Debounced Save
        const timer = setTimeout(() => {
            updateResource({ title: val })
        }, 1000)
        return () => clearTimeout(timer)
    }

    // H4: Properly update linkedItems when dispatch
    const handleDispatch = async (selectedItems: DispatchItem[]) => {
        // Map back to schema: User picks Project/Area
        // Our schema only supports ONE project or ONE area? 
        // Or both? Schema details: projectId, areaId. 
        // So we extract the first project and first area found.

        const project = selectedItems.find(i => i.type === 'project')
        const area = selectedItems.find(i => i.type === 'area')

        const updates: Partial<Resource> = {
            projectId: project?.id || undefined, // undefined to remove? or null? RxDB might prefer null or empty
            areaId: area?.id || undefined
        }

        setData(prev => prev ? { ...prev, linkedItems: selectedItems } : null)
        await updateResource(updates)

        toast.success("Dispatch updated", {
            description: `Linked updated`
        })
    }

    // Handle status change
    const handleStatusChange = async (status: ResourceSidebarStatus) => {
        setData(prev => prev ? { ...prev, status } : null)
        await updateResource({ status })
    }

    const handleAddTag = async (tag: string) => {
        if (!data) return
        const newTags = [...data.tags, tag]
        setData(prev => prev ? { ...prev, tags: newTags } : null)
        await updateResource({ tags: newTags })
    }

    const handleRemoveTag = async (tag: string) => {
        if (!data) return
        const newTags = data.tags.filter(t => t !== tag)
        setData(prev => prev ? { ...prev, tags: newTags } : null)
        await updateResource({ tags: newTags })
    }

    const handleArchive = async () => {
        await handleStatusChange('archived')
        toast("Resource archived")
        navigate('/inbox') // Go back to inbox usually on archive from inbox flow
    }

    const handleDelete = async () => {
        if (!id || !resourceService) return
        if (confirm("Are you sure you want to delete this resource?")) {
            await resourceService.delete(id)
            toast.error("Resource deleted")
            navigate('/inbox')
        }
    }

    if (isLoading) return <div className="h-full flex items-center justify-center p-8 text-muted-foreground animate-pulse">Loading Resource...</div>
    if (!data) return <div className="p-8">Resource not found</div>

    return (
        <div className="flex h-full max-h-[calc(100vh-64px)] overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="px-8 py-4 border-b flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex flex-col">
                            <input
                                className="text-xl font-serif font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/50"
                                value={data.title}
                                onChange={handleTitleChange}
                                placeholder="Untitled Resource"
                            />
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium h-4">
                                {isSaving ? (
                                    <span className="flex items-center gap-1 text-primary">
                                        <Cloud className="w-3 h-3 animate-bounce" /> Saving...
                                    </span>
                                ) : (
                                    lastSaved && <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Saved {lastSaved.toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Scroll Area */}
                <div className="flex-1 overflow-y-auto px-12 py-8 max-w-4xl mx-auto w-full">
                    <TipTapEditor
                        content={data.content}
                        onChange={handleContentChange}
                    />

                    {/* OG Preview Mock */}
                    {data.sourceUrl && (
                        <div className="mt-8 p-4 border rounded-xl bg-muted/20 flex gap-4 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => window.open(data.sourceUrl, '_blank')}>
                            <div className="w-32 h-24 bg-muted rounded-lg shrink-0 flex items-center justify-center text-muted-foreground text-xs">OG Image</div>
                            <div className="flex-1 py-1">
                                <h4 className="font-bold text-sm mb-1 line-clamp-1">{data.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">Source Link</p>
                                <div className="text-[10px] text-muted-foreground/60">{new URL(data.sourceUrl).hostname}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="shrink-0 h-full overflow-y-auto">
                <ResourceSidebar
                    status={data.status}
                    tags={data.tags}
                    sourceUrl={data.sourceUrl}
                    linkedItems={data.linkedItems}
                    onStatusChange={handleStatusChange}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    onDispatch={handleDispatch}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    )
}
