import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { INITIAL_AREAS, Area, INITIAL_PROJECT } from '@/services/mock-data-service'
import { AreaHeader } from '@/components/areas/AreaHeader'
import { AreaSidebar } from '@/components/areas/AreaSidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Plus, LayoutGrid, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const AreaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [area, setArea] = React.useState<Area | undefined>(
        INITIAL_AREAS.find(a => a.id === id)
    )

    if (!area) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-2xl font-bold">找不到此領域</h2>
                <Button onClick={() => navigate('/areas')} variant="link">返回列表</Button>
            </div>
        )
    }

    const handleUpdateArea = (updates: Partial<Area>) => {
        setArea(prev => prev ? { ...prev, ...updates } : prev)
        toast.success('領域資訊已更新')
    }

    const handleDeleteArea = () => {
        toast.error('領域已刪除 (模擬)')
        navigate('/areas')
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AreaHeader
                area={area}
                onTitleChange={(name) => handleUpdateArea({ name })}
                onImageClick={() => toast.info('更換封面功能開發中')}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                            <TabsTrigger value="projects" className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4" />
                                進行中專案
                            </TabsTrigger>
                            <TabsTrigger value="habits" className="flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4" />
                                習慣管理
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">相關專案</h3>
                                <Button size="sm" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    新增專案
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 模擬顯示的一個專案卡片 */}
                                <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/projects/1')}>
                                    <CardContent className="p-4 space-y-2">
                                        <h4 className="font-bold">{INITIAL_PROJECT.name}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {INITIAL_PROJECT.description}
                                        </p>
                                        <div className="pt-2 flex justify-between items-center text-xs">
                                            <span className="px-2 py-0.5 bg-accent rounded-full">Active</span>
                                            <span className="text-muted-foreground">Due: 2026/06/30</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="habits" className="pt-6">
                            <EmptyState
                                icon={CalendarCheck}
                                title="尚未建立核心習慣"
                                description="將你的日常行為轉化為可追蹤的習慣，以達成此領域的長期目標。"
                                action={<Button className="mt-4">建立第一個習慣</Button>}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <AreaSidebar
                        area={area}
                        onUpdate={handleUpdateArea}
                        onDelete={handleDeleteArea}
                    />
                </div>
            </div>
        </div>
    )
}

export default AreaDetailPage
