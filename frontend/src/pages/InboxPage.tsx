import React, { useState } from "react"
import { subHours, subDays } from "date-fns"
import { Sparkles, Plus } from "lucide-react"
import { ResourceItem, Resource } from "@/components/resources/ResourceItem"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- Mock Data ---

const INITIAL_MOCK_RESOURCES: Resource[] = [
    {
        id: "1",
        type: "note",
        title: "Kernel 產品核心理念筆記",
        summary: "這是一份關於 Kernel 的設計哲學筆記，涵蓋了『腦同步』與『收件匣』的核心概念...",
        timestamp: subHours(new Date(), 2),
    },
    {
        id: "2",
        type: "link",
        title: "Building a Second Brain - Tiago Forte",
        summary: "深入探討 CODE 框架：Capture, Organize, Distill, Express，如何建立數位大腦...",
        timestamp: subHours(new Date(), 5),
        url: "https://fortelabs.com/blog/basb/"
    },
    {
        id: "3",
        type: "note",
        title: "2026 年個人發展目標思考",
        summary: "從健康、事業、財務、人際關係四個維度設定 OKRs，並將其拆解為可執行的習慣...",
        timestamp: subDays(new Date(), 1),
    },
    {
        id: "4",
        type: "link",
        title: "React 19 Server Components 深度解析",
        summary: "這篇技術文章詳細說明了 React 19 對於伺服器元件的優化以及更簡單的資料獲取模式...",
        timestamp: subDays(new Date(), 1),
        url: "https://react.dev/blog/react-19"
    }
]

export const InboxPage: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>(INITIAL_MOCK_RESOURCES)

    const handleArchive = (id: string) => {
        console.log("Archive resource:", id)
        setResources(prev => prev.filter(r => r.id !== id))
    }

    const handleDelete = (id: string) => {
        console.log("Delete resource:", id)
        setResources(prev => prev.filter(r => r.id !== id))
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
                <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 px-6">
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
