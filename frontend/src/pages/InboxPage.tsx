import React, { useState } from "react"
import { Sparkles, Plus } from "lucide-react"
import { ResourceItem } from "@/components/resources/ResourceItem"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Archive, Trash2 } from "lucide-react"
import { INITIAL_INBOX_RESOURCES, Resource } from "@/services/mock-data-service"
import { useQuickCapture } from "@/stores/quick-capture-store"

export const InboxPage: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>(INITIAL_INBOX_RESOURCES)
    const { onOpen } = useQuickCapture()

    const handleArchive = (id: string) => {
        const resource = resources.find(r => r.id === id)
        console.log("Archive resource:", id)
        setResources(prev => prev.filter(r => r.id !== id))
        toast.success("資源已歸檔", {
            description: `「${resource?.title}」已移至封存庫。`,
            icon: <Archive className="w-4 h-4 text-primary" />
        })
    }

    const handleDelete = (id: string) => {
        const resource = resources.find(r => r.id === id)
        console.log("Delete resource:", id)
        setResources(prev => prev.filter(r => r.id !== id))
        toast.error("資源已刪除", {
            description: `「${resource?.title}」已從系統中移除。`,
            icon: <Trash2 className="w-4 h-4 text-destructive" />
        })
    }

    return (
        <div className="h-full flex flex-col p-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <span className="bg-primary/20 text-primary p-1.5 rounded-xl">📥</span>
                        收件匣 Inbox
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium pl-1">
                        你有 <span className="text-primary font-bold">{resources.length}</span> 個待處理項目
                    </p>
                </div>
                <Button
                    onClick={onOpen}
                    className="rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 px-6"
                >
                    <Plus className="w-4 h-4" />
                    快速擷取
                </Button>
            </div>

            {/* List / Empty State Area */}
            <div className="flex-1 min-h-0">
                {resources.length > 0 ? (
                    <ScrollArea className="h-full pr-4 -mr-4">
                        <div className="space-y-4 pb-8">
                            {resources.map((resource) => (
                                <ResourceItem
                                    key={resource.id}
                                    resource={resource}
                                    onArchive={handleArchive}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="h-full flex items-center justify-center py-12">
                        <EmptyState
                            icon={Sparkles}
                            title=" Inbox 已清空！"
                            description="太棒了，你已經處理完所有的收件匣資源。現在是開始執行專案的好時機。"
                            action={
                                <Button variant="outline" className="rounded-xl font-bold hover:bg-primary/5 hover:text-primary transition-colors">
                                    查看進行中的專案
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default InboxPage
