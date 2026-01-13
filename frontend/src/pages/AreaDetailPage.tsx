import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dataStore, Area } from '@/services/mock-data-service'
import { AreaHeader } from '@/components/areas/AreaHeader'
import { AreaSidebar } from '@/components/areas/AreaSidebar'
import { CreateAreaModal } from '@/components/areas/CreateAreaModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { HabitManager } from '@/components/habits/HabitManager'
import { LayoutGrid, CalendarCheck, Plus, Library, FileText, Link as LinkIcon, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CreateProjectModal } from '@/components/projects/CreateProjectModal'
import { format } from 'date-fns'

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

    const relatedResources = React.useMemo(() => {
        return area ? dataStore.getResourcesByArea(area.id) : []
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
                        <TabsList className="grid w-full grid-cols-3 max-w-[500px] bg-muted/30 p-1 mb-6">
                            <TabsTrigger value="projects" className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4" />
                                進行中專案
                            </TabsTrigger>
                            <TabsTrigger value="habits" className="flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4" />
                                習慣管理
                            </TabsTrigger>
                            <TabsTrigger value="resources" className="flex items-center gap-2">
                                <Library className="w-4 h-4" />
                                關聯資源
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold tracking-tight">相關專案 <span className="text-sm font-normal text-muted-foreground ml-2">({relatedProjects.length})</span></h3>
                                <Button size="sm" className="gap-2 rounded-lg" onClick={() => setIsCreateProjectOpen(true)}>
                                    <Plus className="w-4 h-4" />
                                    新增專案
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {relatedProjects.length > 0 ? (
                                    relatedProjects.map(project => (
                                        <Card
                                            key={project.id}
                                            className="group hover:border-primary/50 transition-all cursor-pointer bg-card/50 hover:bg-card hover:shadow-md"
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                        >
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</h4>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50 transition-all group-hover:translate-x-1" />
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {project.description}
                                                </p>
                                                <div className="pt-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                                                    <span className="px-2 py-1 bg-accent/50 rounded-md border border-border/50">{project.status}</span>
                                                    <span>Due: {format(project.dueDate, "yyyy/MM/dd")}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center border-dashed border-2 rounded-2xl bg-muted/5">
                                        <p className="text-muted-foreground font-medium">此領域尚無關聯專案</p>
                                        <Button variant="link" size="sm" className="mt-2" onClick={() => setIsCreateProjectOpen(true)}>點此建立第一個專案</Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="habits" className="">
                            <HabitManager areaId={area.id} />
                        </TabsContent>

                        <TabsContent value="resources" className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold tracking-tight">關聯資源 <span className="text-sm font-normal text-muted-foreground ml-2">({relatedResources.length})</span></h3>
                            </div>

                            {relatedResources.length > 0 ? (
                                <div className="space-y-3">
                                    {relatedResources.map((resource) => (
                                        <div
                                            key={resource.id}
                                            className="group flex items-start gap-4 p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-pointer relative overflow-hidden"
                                            onClick={() => navigate(`/resources/${resource.id}`)}
                                        >
                                            <div className={`mt-0.5 p-2.5 rounded-lg flex items-center justify-center transition-shadow shadow-sm ${resource.type === "note" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-600"
                                                }`}>
                                                {resource.type === "note" ? (
                                                    <FileText className="w-5 h-5" />
                                                ) : (
                                                    <LinkIcon className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-6">
                                                <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                                                    {resource.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed opacity-80">
                                                    {resource.summary}
                                                </p>
                                                <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                    <span>{format(resource.timestamp, "yyyy/MM/dd")}</span>
                                                    {resource.url && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                            <span>{new URL(resource.url).hostname}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/20 group-hover:text-primary/40 transition-all group-hover:translate-x-1" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center border-dashed border-2 rounded-2xl bg-muted/5 flex flex-col items-center">
                                    <Library className="w-12 h-12 text-muted-foreground/20 mb-4" />
                                    <p className="text-muted-foreground font-medium">尚未關聯任何資源至此領域。</p>
                                </div>
                            )}
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
