import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Archive, Trash2, FolderPlus, ExternalLink, Link as LinkIcon, Hash } from "lucide-react"
import { DispatchModal, DispatchItem } from "./DispatchModal"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type ResourceSidebarStatus = "processed" | "archived" | "inbox"

export interface ResourceSidebarProps {
    status: ResourceSidebarStatus
    tags: string[]
    sourceUrl?: string
    linkedItems: DispatchItem[]
    onStatusChange: (status: ResourceSidebarStatus) => void
    onAddTag: (tag: string) => void
    onRemoveTag: (tag: string) => void
    onDispatch: (selectedItems: DispatchItem[]) => void
    onArchive: () => void
    onDelete: () => void
}

export function ResourceSidebar({
    status,
    tags,
    sourceUrl,
    linkedItems,
    onStatusChange,
    onAddTag,
    onRemoveTag,
    onDispatch,
    onArchive,
    onDelete
}: ResourceSidebarProps) {
    const [isDispatchOpen, setIsDispatchOpen] = useState(false)
    const [tagInput, setTagInput] = useState("")

    const handleTagSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            onAddTag(tagInput.trim())
            setTagInput("")
        }
    }

    const handleDispatchConfirm = (selectedItems: DispatchItem[]) => {
        onDispatch(selectedItems)
        // H5: Auto-change status to processed if currently inbox
        if (status === "inbox" && selectedItems.length > 0) {
            onStatusChange("processed")
        }
    }

    return (
        <div className="w-80 border-l h-full p-4 flex flex-col gap-6 bg-muted/10">
            {/* Status Section */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Properties</h4>
                <div className="grid gap-2">
                    <Select value={status} onValueChange={(v) => onStatusChange(v as ResourceSidebarStatus)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="inbox">Inbox</SelectItem>
                            <SelectItem value="processed">Processed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />

            {/* Linked Context (PARA) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Connect</h4>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsDispatchOpen(true)}
                        title="Link to Project/Area"
                    >
                        <FolderPlus className="w-3.5 h-3.5" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {linkedItems.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No linked projects or areas.</p>
                    )}
                    {linkedItems.map(item => (
                        <Badge key={item.id} variant="secondary" className="gap-1 pl-2 pr-2 py-1 bg-white dark:bg-muted shadow-sm hover:bg-muted/80">
                            {item.type === 'project' ? '📁' : '🔷'} {item.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="outline" className="gap-1 pr-1">
                            {tag}
                            <button
                                onClick={() => onRemoveTag(tag)}
                                className="hover:text-destructive transition-colors"
                            >
                                <span className="sr-only">Remove</span>
                                ×
                            </button>
                        </Badge>
                    ))}
                    <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagSubmit}
                        className="h-7 text-xs"
                    />
                </div>
            </div>

            <Separator />

            {/* Source */}
            {sourceUrl && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" /> Source
                    </h4>
                    <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary underline break-all flex items-start gap-2 hover:opacity-80 transition-opacity"
                    >
                        <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        {new URL(sourceUrl).hostname}
                    </a>
                </div>
            )}

            <div className="mt-auto space-y-2">
                <Button
                    variant="secondary"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={onArchive}
                >
                    <Archive className="mr-2 w-4 h-4" />
                    Archive Resource
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={onDelete}
                >
                    <Trash2 className="mr-2 w-4 h-4" />
                    Delete Permanently
                </Button>
            </div>

            <DispatchModal
                isOpen={isDispatchOpen}
                onOpenChange={setIsDispatchOpen}
                onConfirm={handleDispatchConfirm}
                initialSelected={linkedItems}
            />
        </div>
    )
}
