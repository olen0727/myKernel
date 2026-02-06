import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ListTodo, Library, GripVertical, FileText, Link as LinkIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "@/components/projects/ProjectHeader"
import { ProjectSidebar } from "@/components/projects/ProjectSidebar"
import { TaskList } from "@/components/tasks/TaskList"
import { toast } from "sonner"
import { services, ProjectService, TaskService, ResourceService, AreaService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { Task, Project, Area, Resource } from "@/types/models"

// Redefine TaskListGroup locally to decouple from mock service
interface TaskListGroupType {
    id: string
    title: string
    items: Task[]
}

import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { TaskItem } from "@/components/tasks/TaskItem"


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

export default function ProjectDetailPage() {
    const { id: projectId } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [projectService, setProjectService] = React.useState<ProjectService | undefined>();
    const [taskService, setTaskService] = React.useState<TaskService | undefined>();
    const [resourceService, setResourceService] = React.useState<ResourceService | undefined>();
    const [areaService, setAreaService] = React.useState<AreaService | undefined>();

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [cascadeInfo, setCascadeInfo] = React.useState<{ taskCount: number } | null>(null);


    React.useEffect(() => {
        const load = async () => {
            setProjectService(await services.project);
            setTaskService(await services.task);
            setResourceService(await services.resource);
            setAreaService(await services.area);
        };
        load();
    }, []);

    const project$ = React.useMemo(() => projectService?.getById$(projectId!), [projectService, projectId]);
    const areas$ = React.useMemo(() => areaService?.getAll$(), [areaService]);
    const tasks$ = React.useMemo(() => taskService?.getByProject$(projectId!), [taskService, projectId]);
    const allResources$ = React.useMemo(() => resourceService?.getAll$(), [resourceService]);

    const project = useObservable<Project | null>(project$, null);
    const areas = useObservable<Area[]>(areas$, []) || [];

    // Use getByProject$ implemented in TaskService.
    const tasks = useObservable<Task[]>(tasks$, []) || [];

    // For resources, filter client side for MVP
    const allResources = useObservable<Resource[]>(allResources$, []) || [];
    const projectResources = React.useMemo(() =>
        allResources.filter(r => r.projectId === projectId || r.context === projectId),
        [allResources, projectId]);

    const [activeId, setActiveId] = React.useState<string | null>(null)

    // Adapt flat tasks to TaskListGroup structure (Single Group for now)
    const taskLists: TaskListGroupType[] = React.useMemo(() => {
        return [{
            id: 'default',
            title: '所有任務',
            items: tasks.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
        }];
    }, [tasks]);

    // --- Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const activeTask = React.useMemo(() => {
        if (!activeId) return null
        return tasks.find(t => t.id === activeId) || null
    }, [activeId, tasks])

    // --- Stats ---
    const taskStats = React.useMemo(() => {
        const total = tasks.length
        const done = tasks.filter(t => t.status === 'done').length
        return { done, total }
    }, [tasks])

    // --- DnD Handlers ---
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragOver = (_event: DragOverEvent) => {
        // Single list, simplified logic not strictly needed if only one container
    }

    const handleDragEnd = (_event: DragEndEvent) => {
        setActiveId(null)
        // No persistence for reorder yet
    }

    // --- Handlers ---
    const handleUpdateProject = async (updates: any) => {
        if (!projectId || !projectService) return;
        try {
            await projectService.update(projectId, updates);
            toast.success("專案已更新")
        } catch (e) {
            toast.error("更新失敗")
        }
    }

    const handleTaskToggle = async (_listId: string, taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task && taskService) {
            const newStatus = task.status === 'done' ? 'todo' : 'done';
            await taskService.update(taskId, { status: newStatus });
        }
    }

    const handleTaskTitleChange = async (_listId: string, taskId: string, newTitle: string) => {
        if (taskService)
            await taskService.update(taskId, { title: newTitle });
    }

    const handleAddTask = async (_listId: string, title: string) => {
        if (!projectId || !taskService) return;
        await taskService.create({
            title,
            projectId,
            status: 'todo',
            completed: undefined // Ensure no legacy field is sent if type allows
        } as any);
        toast.success("任務已建立");
    }



    const handleRenameList = (_listId: string, _newTitle: string) => {
        // Not supported
    }

    const handleDeleteList = (_listId: string) => {
        // Not supported
    }

    const handleDeleteClick = async () => {
        if (!projectId || !projectService) return;
        try {
            const info = await projectService.getCascadeInfo(projectId);
            setCascadeInfo(info);
            setDeleteConfirmOpen(true);
        } catch (e) {
            console.error(e);
            setCascadeInfo({ taskCount: 0 });
            setDeleteConfirmOpen(true);
        }
    }

    const confirmDelete = async () => {
        if (!projectId || !projectService) return;
        try {
            await projectService.delete(projectId);
            toast.success('專案已刪除');
            navigate("/projects");
        } catch (e) {
            toast.error('刪除失敗');
        }
        setDeleteConfirmOpen(false);
    }

    if (!project || !projectService) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
                <div className="flex items-center gap-4 px-6 py-4 border-b">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/projects")} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Projects</span>
                        <span>/</span>
                        <span className="font-medium text-foreground">{project.name}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex h-full">
                    {/* Main Content: 70% */}
                    <div className="w-[70%] overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-10">
                            <ProjectHeader
                                title={project.name}
                                description={project.description || ''}
                                doneTasks={taskStats.done}
                                totalTasks={taskStats.total}
                                onTitleChange={(name) => handleUpdateProject({ name })}
                                onDescriptionChange={(description) => handleUpdateProject({ description })}
                            />

                            <Tabs defaultValue="tasks" className="w-full">
                                <TabsList className="bg-muted/30 p-1 mb-6">
                                    <TabsTrigger value="tasks" className="gap-2">
                                        <ListTodo className="h-4 w-4" />
                                        任務清單 (Tasks)
                                    </TabsTrigger>
                                    <TabsTrigger value="resources" className="gap-2">
                                        <Library className="h-4 w-4" />
                                        專案資源 (Resources)
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="tasks" className="space-y-8 min-h-[400px]">
                                    <div className="space-y-4">
                                        {taskLists.map(list => (
                                            <TaskList
                                                key={list.id}
                                                id={list.id}
                                                title={list.title}
                                                items={list.items as any}
                                                onTaskToggle={handleTaskToggle}
                                                onTaskTitleChange={handleTaskTitleChange}
                                                onAddTask={handleAddTask}
                                                onRenameList={handleRenameList}
                                                onDeleteList={handleDeleteList}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="resources" className="min-h-[400px]">
                                    {projectResources.length > 0 ? (
                                        <div className="space-y-3">
                                            {projectResources.map((resource) => (
                                                <div
                                                    key={resource.id}
                                                    className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer"
                                                >
                                                    <div className={`mt-0.5 p-2.5 rounded-lg flex items-center justify-center ${resource.type === "note"
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-blue-500/10 text-blue-600"
                                                        }`}>
                                                        {resource.type === "note" ? (
                                                            <FileText className="w-5 h-5" />
                                                        ) : (
                                                            <LinkIcon className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                                            {resource.title}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                                                            {resource.content || resource.url}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground/60 mt-2">
                                                            建立於 {resource.createdAt ? format(new Date(resource.createdAt), "yyyy/MM/dd", { locale: zhTW }) : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-muted/10 border border-dashed rounded-xl flex items-center justify-center p-12">
                                            <p className="text-muted-foreground">尚未關聯任何資源至此專案。</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar: 30% */}
                    <div className="w-[30%] min-w-[280px] max-w-[400px] overflow-y-auto py-8 pr-8">
                        <ProjectSidebar
                            projectName={project.name}
                            status={project.status}
                            area={project.areaId || ''}
                            dueDate={undefined}
                            onStatusChange={(status) => handleUpdateProject({ status })}
                            onAreaChange={(areaId: string) => handleUpdateProject({ areaId })}
                            onDueDateChange={(dueDate: Date | undefined) => handleUpdateProject({ dueDate })}
                            onArchive={() => handleUpdateProject({ status: "archived" })}
                            onDelete={handleDeleteClick}
                            areas={areas}
                        />
                    </div>
                </div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeTask ? (
                        <div className="w-full max-w-[500px] bg-background/70 backdrop-blur-sm border-2 border-primary/30 rounded-md shadow-2xl p-2 flex items-center gap-3 scale-[0.98] rotate-1 cursor-grabbing opacity-70">
                            <GripVertical className="h-4 w-4 text-primary" />
                            <TaskItem {...activeTask} editable={false} showProject={false} />
                        </div>
                    ) : null}
                </DragOverlay>

                <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>確定要刪除「{project.name}」嗎？</AlertDialogTitle>
                            <AlertDialogDescription>
                                此動作無法復原。這將會一併刪除此專案內的：
                                {cascadeInfo && (
                                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
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
        </DndContext>
    )
}
