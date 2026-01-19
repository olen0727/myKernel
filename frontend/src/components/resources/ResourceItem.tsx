import React from "react"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
    FileText,
    Link as LinkIcon,
    Archive,
    Trash2,
    ExternalLink,
    ChevronRight,
    FolderPlus,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { DispatchModal } from "./DispatchModal"

export type ResourceType = "note" | "link"

export interface Resource {
    id: string
    type: ResourceType
    title: string
    summary: string
    timestamp: Date
    url?: string
}

interface ResourceItemProps {
    resource: Resource
    onArchive: (id: string) => void
    onDelete: (id: string) => void
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
    resource,
    onArchive,
    onDelete
}) => {
    const navigate = useNavigate()
    const [isDispatchOpen, setIsDispatchOpen] = React.useState(false)

    const handleConfirmDispatch = (selectedIds: string[]) => {
        console.log(`Dispatching resource ${resource.id} to:`, selectedIds)
        toast.success("資源分流成功", {
            description: `已將「${resource.title}」標記為已處理並關聯至 ${selectedIds.length} 個目標。`,
            icon: <CheckCircle2 className="w-4 h-4 text-primary" />
        })
        onArchive(resource.id) // Mock process by removing from inbox
    }

    const Icon = resource.type === "note" ? FileText : LinkIcon

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    onClick={() => navigate(`/resources/${resource.id}`)}
                    className="group relative flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all cursor-pointer overflow-hidden"
                    data-testid="resource-item"
                >
                    {/* Left Icon Area */}
                    <div className={cn(
                        "mt-1 p-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm",
                        resource.type === "note" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-600"
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 pr-20">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors tracking-tight">
                                {resource.title}
                            </h4>
                            <span className="shrink-0 text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest px-1.5 py-0.5 rounded border border-border/30">
                                {resource.type}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl font-medium opacity-80">
                            {resource.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            <span>{formatDistanceToNow(resource.timestamp, { addSuffix: true })}</span>
                            {resource.url && (
                                <span className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                    {new URL(resource.url).hostname}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Hover Actions */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsDispatchOpen(true)
                            }}
                            title="連結至專案/領域 (分流)"
                        >
                            <FolderPlus className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation()
                                onArchive(resource.id)
                            }}
                            title="歸檔"
                        >
                            <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-600 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(resource.id)
                            }}
                            title="刪除"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="ml-1 pl-1 border-l border-border/50">
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-48 rounded-xl border-border/50 shadow-2xl backdrop-blur-md bg-popover/95">
                <ContextMenuItem onClick={() => navigate(`/resources/${resource.id}`)}>
                    <ExternalLink className="mr-2 h-4 w-4 opacity-60" />
                    <span>開啟編輯器</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setIsDispatchOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4 opacity-60" />
                    <span>連結至專案/領域 (P)</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onArchive(resource.id)}>
                    <Archive className="mr-2 h-4 w-4 opacity-60" />
                    <span>歸檔 (E)</span>
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => onDelete(resource.id)}
                    className="text-red-500 focus:text-red-500"
                >
                    <Trash2 className="mr-2 h-4 w-4 opacity-60" />
                    <span>刪除 (Del)</span>
                </ContextMenuItem>
            </ContextMenuContent>
            <DispatchModal
                isOpen={isDispatchOpen}
                onOpenChange={setIsDispatchOpen}
                onConfirm={handleConfirmDispatch}
            />
        </ContextMenu>
    )
}
