import React, { useMemo, useState, useEffect } from "react"
import { Sparkles, Plus } from "lucide-react"
import { ResourceItem, Resource as ComponentResource, ResourceStatus } from "@/components/resources/ResourceItem"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Archive, Trash2 } from "lucide-react"
import { useQuickCapture } from "@/stores/quick-capture-store"
import { services, ResourceService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { useNavigate } from "react-router-dom"
import { Resource } from "@/types/models"
import { DispatchItem } from "@/components/resources/DispatchModal"
import { Check } from "lucide-react"

export const InboxPage: React.FC = () => {
    const navigate = useNavigate();
    const { onOpen } = useQuickCapture()

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
            // Logic for "Inbox": No project, No area, and Status is not archived
            // Or explicitly status === 'inbox' (if we set it)
            // Default is inbox if context missing.
            const isArchived = r.status === 'archived';
            const isProcessed = r.status === 'processed' || ((r.projectIds && r.projectIds.length > 0) || (r.areaIds && r.areaIds.length > 0));

            return !isArchived && !isProcessed;
        }).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }, [allResources]);

    const handleArchive = async (id: string) => {
        if (!resourceService) return;
        try {
            const r = allResources.find(res => res.id === id);
            await resourceService.update(id, { status: 'archived' });
            toast.success("資源已封存", {
                description: `「${r?.title}」已移至封存庫。`,
                icon: <Archive className="w-4 h-4 text-primary" />
            })
        } catch (e) {
            toast.error("封存失敗");
        }
    }

    const handleDelete = async (id: string) => {
        if (!resourceService) return;
        try {
            const r = allResources.find(res => res.id === id);
            await resourceService.delete(id);
            toast.success("資源已刪除", {
                description: `「${r?.title}」已從系統中移除。`,
                icon: <Trash2 className="w-4 h-4 text-destructive" />
            })
        } catch (e) {
            toast.error("刪除失敗");
        }
    }

    const handleDispatch = async (id: string, selectedItems: DispatchItem[]) => {
        if (!resourceService) return;
        try {
            const r = allResources.find(res => res.id === id);

            // Extract Project IDs and Area IDs from selected items
            const projectIds = selectedItems.filter(i => i.type === 'project').map(i => i.id);
            const areaIds = selectedItems.filter(i => i.type === 'area').map(i => i.id);

            await resourceService.update(id, {
                status: 'processed',
                projectIds,
                areaIds
            });

            toast.success("資源分流成功", {
                description: `已將「${r?.title}」標記為已處理並關聯至 ${selectedItems.length} 個目標。`,
                // eslint-disable-next-line react/jsx-no-undef
                icon: <Check className="w-4 h-4 text-primary" />
            });
        } catch (e) {
            toast.error("分流更新失敗");
        }
    }

    // Map DB Resource to Component Resource
    const mappedResources: ComponentResource[] = useMemo(() => {
        return inboxResources.map(r => ({
            id: r.id,
            type: r.type as any, // 'link' | 'note' | 'document' -> 'link' | 'note' 
            title: r.title,
            summary: r.content || '',
            timestamp: new Date(r.createdAt || Date.now()),
            url: r.url,
            status: (r.status || 'inbox') as ResourceStatus,
            tags: r.tags || [],
            linkedItems: []
        }));
    }, [inboxResources]);

    if (!resourceService) {
        return <div className="h-full flex items-center justify-center">Loading Inbox...</div>
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
                        你有 <span className="text-primary font-bold">{inboxResources.length}</span> 個待處理項目
                    </p>
                </div>
                <Button
                    onClick={onOpen}
                    className="rounded-xl font-bold font-mono shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 px-6"
                >
                    <Plus className="w-4 h-4" />
                    快速擷取
                </Button>
            </div>

            {/* List / Empty State Area */}
            <div className="flex-1 min-h-0">
                {mappedResources.length > 0 ? (
                    <ScrollArea className="h-full pr-4 -mr-4">
                        <div className="space-y-4 pb-8">
                            {mappedResources.map((resource) => (
                                <ResourceItem
                                    key={resource.id}
                                    resource={resource}
                                    onArchive={handleArchive}
                                    onDelete={handleDelete}
                                    onDispatch={handleDispatch}
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
                                <Button variant="outline" className="rounded-xl font-bold hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => navigate('/projects')}>
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

export default InboxPage;
