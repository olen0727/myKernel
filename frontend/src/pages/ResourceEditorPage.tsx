import { useParams, useNavigate } from "react-router-dom"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { ResourceSidebar } from "@/components/resources/ResourceSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Cloud, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

// Mock Data Source
const MOCK_DATA: Record<string, any> = {
    "1": {
        id: "1",
        title: "Kernel Architecture Design",
        content: "<h2>Overview</h2><p>The system is divided into frontend and backend...</p>",
        status: "processed",
        tags: ["architecture", "design"],
        linkedItems: [
            { id: "p1", name: "Kernel Development", type: "project" }
        ]
    },
    "2": {
        id: "2",
        title: "React Documentation",
        content: "<p>Link: https://react.dev</p>",
        status: "processed",
        tags: ["react", "frontend"],
        sourceUrl: "https://react.dev",
        linkedItems: []
    }
}

export default function ResourceEditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    useEffect(() => {
        // Simulate fetch
        if (id && MOCK_DATA[id]) {
            setData(MOCK_DATA[id])
        }
    }, [id])

    const handleContentChange = (content: string) => {
        setIsSaving(true)
        // Debounce save logic
        setTimeout(() => {
            setIsSaving(false)
            setLastSaved(new Date())
        }, 1000)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev: any) => ({ ...prev, title: e.target.value }))
        handleContentChange("")
    }

    if (!data) return <div className="p-8">Loading...</div>

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
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">Detailed description fetched from og tags on the target URL...</p>
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
                    onStatusChange={(status) => setData({ ...data, status })}
                    onAddTag={(tag) => setData({ ...data, tags: [...data.tags, tag] })}
                    onRemoveTag={(tag) => setData({ ...data, tags: data.tags.filter((t: string) => t !== tag) })}
                    onDispatch={(ids) => {
                        toast.success("Dispatch updated", { description: `Linked to ${ids.length} items` })
                        // Mock update linked items from IDs
                    }}
                    onArchive={() => {
                        setData({ ...data, status: 'archived' })
                        toast("Resource archived")
                        navigate('/resources')
                    }}
                    onDelete={() => {
                        toast.error("Resource deleted")
                        navigate('/resources')
                    }}
                />
            </div>
        </div>
    )
}
