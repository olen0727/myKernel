import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dataStore, Area } from '@/services/mock-data-service'
import { AreaHeader } from '@/components/areas/AreaHeader'
import { AreaSidebar } from '@/components/areas/AreaSidebar'
import { CreateAreaModal } from '@/components/areas/CreateAreaModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { HabitManager } from '@/components/habits/HabitManager'
import { LayoutGrid, CalendarCheck, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CreateProjectModal } from '@/components/projects/CreateProjectModal'

const AreaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [area, setArea] = React.useState<Area | undefined>(
        id ? dataStore.getAreaById(id) : undefined
    )
    const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false)
    const [isCoverModalOpen, setIsCoverModalOpen] = React.useState(false)

    // Derived data - in real app would be filtered in dataStore
    const relatedProjects = React.useMemo(() => {
        return area ? dataStore.getProjectsByArea(area.name) : []
    }, [area])

    if (!area) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-2xl font-bold">找不到此領域</h2>
                <Button onClick={() => navigate('/areas')} variant="link">返回列表</Button>
            </div>
        )
    }

    const handleUpdateArea = (updates: Partial<Area>) => {
        if (!id) return
        dataStore.updateArea(id, updates)
        setArea({ ...area, ...updates })
        toast.success('領域資訊已更新')
    }

    const handleDeleteArea = () => {
        if (!id) return
        dataStore.deleteArea(id)
        toast.error('領域已刪除')
        navigate('/areas')
    }

    const handleCreateProject = (values: any) => {
        toast.success(`專案「${values.name}」已建立於 ${values.area}`)
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AreaHeader
                area={area}
                onTitleChange={(name) => handleUpdateArea({ name })}
                onImageClick={() => setIsCoverModalOpen(true)}
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
                                <Button size="sm" className="gap-2" onClick={() => setIsCreateProjectOpen(true)}>
                                    <Plus className="w-4 h-4" />
                                    新增專案
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {relatedProjects.length > 0 ? (
                                    relatedProjects.map(project => (
                                        <Card
                                            key={project.id}
                                            className="hover:border-primary/50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                        >
                                            <CardContent className="p-4 space-y-2">
                                                <h4 className="font-bold">{project.name}</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {project.description}
                                                </p>
                                                <div className="pt-2 flex justify-between items-center text-xs">
                                                    <span className="px-2 py-0.5 bg-accent rounded-full capitalize">{project.status}</span>
                                                    <span className="text-muted-foreground">Due: {project.dueDate.toLocaleDateString()}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center border-dashed border-2 rounded-xl text-muted-foreground">
                                        此領域尚無關聯專案
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="habits" className="pt-6">
                            <HabitManager areaId={area.id} />
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

            <CreateProjectModal
                open={isCreateProjectOpen}
                onOpenChange={setIsCreateProjectOpen}
                onSubmit={handleCreateProject}
                defaultValues={{
                    area: area.name
                }}
            />

            <CreateAreaModal
                isOpen={isCoverModalOpen}
                onClose={() => setIsCoverModalOpen(false)}
                initialData={{
                    name: area.name,
                    coverImage: area.coverImage
                }}
                onSubmit={(name, cover) => handleUpdateArea({ name, coverImage: cover })}
            />
        </div>
    )
}

export default AreaDetailPage
