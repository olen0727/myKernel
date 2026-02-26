import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AreaHeader } from '@/components/areas/AreaHeader'
import { AreaSidebar } from '@/components/areas/AreaSidebar'
import { CreateAreaModal } from '@/components/areas/CreateAreaModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HabitManager } from '@/components/habits/HabitManager'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { LayoutGrid, CalendarCheck, Plus, Library, FileText, Link as LinkIcon, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CreateProjectModal } from '@/components/projects/CreateProjectModal'
import { format } from 'date-fns'
import { services, AreaService, ProjectService, ResourceService, TaskService, HabitService } from '@/services'
import { useObservable } from '@/hooks/use-observable'
import { Area, Project, Resource, Task, Habit } from '@/types/models'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const AreaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [areaService, setAreaService] = useState<AreaService | undefined>();
    const [projectService, setProjectService] = useState<ProjectService | undefined>();
    const [resourceService, setResourceService] = useState<ResourceService | undefined>();
    const [taskService, setTaskService] = useState<TaskService | undefined>();
    const [habitService, setHabitService] = useState<HabitService | undefined>();

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [cascadeInfo, setCascadeInfo] = useState<{ projectCount: number, taskCount: number } | null>(null);

    useEffect(() => {
        const load = async () => {
            setAreaService(await services.area);
            setProjectService(await services.project);
            setResourceService(await services.resource);
            setTaskService(await services.task);
            setHabitService(await services.habit);
        };
        load();
    }, []);

    const area$ = useMemo(() => areaService?.getById$(id!), [areaService, id]);
    const allProjects$ = useMemo(() => projectService?.getAll$(), [projectService]);
    const allResources$ = useMemo(() => resourceService?.getAll$(), [resourceService]);
    const allTasks$ = useMemo(() => taskService?.getAll$(), [taskService]);
    const allHabits$ = useMemo(() => habitService?.getAll$(), [habitService]);

    const area = useObservable<Area | null>(area$, null);
    const allProjects = useObservable<Project[]>(allProjects$, []) || [];
    const allResources = useObservable<Resource[]>(allResources$, []) || [];
    const allTasks = useObservable<Task[]>(allTasks$, []) || [];
    const allHabits = useObservable<Habit[]>(allHabits$, []) || [];

    const relatedProjects = useMemo(() => allProjects.filter(p => p.areaId === id), [allProjects, id]);
    const relatedResources = useMemo(() => allResources.filter(r => r.areaIds?.includes(id!)), [allResources, id]);
    // Assuming Habit has areaId, loosely typed for now as interface might not be updated
    const relatedHabits = useMemo(() => allHabits.filter(h => (h as any).areaId === id), [allHabits, id]);

    const areaWithStats = useMemo(() => {
        if (!area) return null;
        return {
            ...area,
            projectCount: relatedProjects.length,
            habitCount: relatedHabits.length
        };
    }, [area, relatedProjects, relatedHabits]);


    const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false)
    const [isCoverModalOpen, setIsCoverModalOpen] = React.useState(false)

    if (!areaWithStats || !areaService) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                {areaService ? (
                    <>
                        <h2 className="text-2xl font-bold">找不到此領域或正在載入</h2>
                        <Button onClick={() => navigate('/areas')} variant="link">返回列表</Button>
                    </>
                ) : (
                    <Loader2 className="w-8 h-8 animate-spin" />
                )}
            </div>
        )
    }

    const handleUpdateArea = async (updates: Partial<Area>) => {
        if (!id || !areaService) return
        try {
            await areaService.update(id, updates);
            toast.success('領域資訊已更新')
            // Observable updates UI
        } catch (e) {
            toast.error('更新失敗')
        }
    }

    const handleDeleteClick = async () => {
        if (!id || !areaService) return;
        try {
            const info = await areaService.getCascadeInfo(id);
            setCascadeInfo(info);
            setDeleteConfirmOpen(true);
        } catch (e) {
            console.error(e);
            // Fallback if generic error, still confirm but no count
            setCascadeInfo({ projectCount: 0, taskCount: 0 });
            setDeleteConfirmOpen(true);
        }
    }

    const confirmDelete = async () => {
        if (!id || !areaService) return
        try {
            await areaService.delete(id);
            toast.success('領域已刪除')
            navigate('/areas')
        } catch (e) {
            toast.error('刪除失敗')
        }
        setDeleteConfirmOpen(false);
    }

    const handleCreateProject = async (values: any) => {
        if (!projectService) return;
        try {
            await projectService.create({
                name: values.name,
                areaId: areaWithStats.id,
                status: 'active',
                progress: 0
            });
            toast.success(`專案「${values.name}」已建立於 ${areaWithStats.name}`)
        } catch (e) {
            toast.error('建立專案失敗')
        }
    }

    const handleProjectStatusChange = async (projectId: string, newStatus: Project['status']) => {
        if (!projectService) return;
        try {
            await projectService.update(projectId, { status: newStatus });
            toast.success("專案狀態已更新");
        } catch (error) {
            toast.error("更新專案狀態失敗");
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AreaHeader
                area={areaWithStats as any}
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
                                    relatedProjects.map(project => {
                                        const pTasks = allTasks.filter(t => t.projectId === project.id);
                                        const done = pTasks.filter(t => t.status === 'done').length;
                                        const total = pTasks.length;
                                        const areaName = areaWithStats.name;

                                        return (
                                            <ProjectCard
                                                key={project.id}
                                                id={project.id}
                                                name={project.name}
                                                area={areaName}
                                                status={project.status}
                                                doneTasks={done}
                                                totalTasks={total}
                                                onClick={() => navigate(`/projects/${project.id}`)}
                                                onStatusChange={handleProjectStatusChange}
                                            />
                                        )
                                    })
                                ) : (
                                    <div className="col-span-full py-16 text-center border-dashed border-2 rounded-2xl bg-muted/5">
                                        <p className="text-muted-foreground font-medium">此領域尚無關聯專案</p>
                                        <Button variant="link" size="sm" className="mt-2" onClick={() => setIsCreateProjectOpen(true)}>點此建立第一個專案</Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="habits" className="">
                            <HabitManager areaId={areaWithStats.id} />
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
                                                    {resource.content || ''}
                                                </p>
                                                <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                    <span>{resource.createdAt ? format(new Date(resource.createdAt), "yyyy/MM/dd") : '-'}</span>
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
                        area={areaWithStats as any}
                        onUpdate={handleUpdateArea}
                        onDelete={handleDeleteClick}
                    />
                </div>
            </div>

            <CreateProjectModal
                areas={[]}
                open={isCreateProjectOpen}
                onOpenChange={setIsCreateProjectOpen}
                onSubmit={handleCreateProject}
                defaultValues={{
                    area: areaWithStats?.name || ''
                }}
            />

            <CreateAreaModal
                isOpen={isCoverModalOpen}
                onClose={() => setIsCoverModalOpen(false)}
                initialData={{
                    name: areaWithStats.name,
                    coverImage: areaWithStats.coverImage || ''
                }}
                onSubmit={(name, cover) => handleUpdateArea({ name, coverImage: cover })}
            />

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>確定要刪除「{areaWithStats.name}」嗎？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此動作無法復原。這將會一併刪除此領域內的：
                            {cascadeInfo && (
                                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                                    <li>{cascadeInfo.projectCount} 個專案 (Projects)</li>
                                    <li>{cascadeInfo.taskCount} 個任務 (Tasks)</li>
                                </ul>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            確認刪除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AreaDetailPage
