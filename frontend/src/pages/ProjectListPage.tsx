import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Workbench } from "@/components/projects/Workbench"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { services, ProjectService, AreaService, TaskService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { ProjectStatus, Project, Area, Task } from "@/types/models"
import { toast } from "sonner"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

type FilterStatus = "all" | ProjectStatus;

export default function ProjectListPage() {
    const navigate = useNavigate()

    const [projectService, setProjectService] = useState<ProjectService | undefined>();
    const [areaService, setAreaService] = useState<AreaService | undefined>();
    const [taskService, setTaskService] = useState<TaskService | undefined>();

    useEffect(() => {
        const load = async () => {
            setProjectService(await services.project);
            setAreaService(await services.area);
            setTaskService(await services.task);
        };
        load();
    }, []);

    const projects$ = useMemo(() => projectService?.getAll$(), [projectService]);
    const areas$ = useMemo(() => areaService?.getAll$(), [areaService]);
    const allTasks$ = useMemo(() => taskService?.getAll$(), [taskService]);

    const projects = useObservable<Project[]>(projects$, []) || [];
    const areas = useObservable<Area[]>(areas$, []) || [];
    const allTasks = useObservable<Task[]>(allTasks$, []) || [];

    const [filterStatus, setFilterStatus] = useState<FilterStatus>("active")
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Derived state for display
    const projectCards: ProjectCardProps[] = useMemo(() => {
        return projects.map(p => {
            const pTasks = allTasks.filter(t => t.projectId === p.id);
            const done = pTasks.filter(t => t.status === 'done').length;
            const total = pTasks.length;
            const areaName = areas.find(a => a.id === p.areaId)?.name || 'General';

            return {
                id: p.id,
                name: p.name,
                area: areaName,
                status: p.status,
                doneTasks: done,
                totalTasks: total
            };
        });
    }, [projects, areas, allTasks]);

    const filteredProjects = projectCards.filter(project => {
        if (filterStatus === "all") return true
        return project.status === filterStatus
    })

    const handleCreateProject = async (values: any) => {
        if (!projectService) return;
        try {
            const newProject = await projectService.create({
                name: values.name,
                areaId: values.area, // CreateProjectModal returns areaId now
                status: 'active',
                progress: 0
            });
            toast.success("專案已建立");
            navigate(`/projects/${newProject.id}`)
        } catch (error) {
            console.error("Failed to create project:", error);
            toast.error("建立專案失敗");
        }
    }

    const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
        if (!projectService) return;
        try {
            await projectService.update(projectId, { status: newStatus });
            toast.success("專案狀態已更新");
        } catch (error) {
            toast.error("更新專案狀態失敗");
        }
    }

    if (!projectService || !areaService || !taskService) {
        return <div className="h-full flex items-center justify-center">Loading Projects...</div>
    }

    return (
        <div className="h-full w-full bg-background flex flex-col">
            <ResizablePanelGroup direction="vertical" className="min-h-full">
                {/* Top: Workbench */}
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="h-full border-b overflow-hidden">
                        <Workbench />
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Bottom: Project List */}
                <ResizablePanel defaultSize={60}>
                    <div className="h-full flex flex-col bg-muted/5">
                        <div className="flex items-center justify-between px-6 py-6 scroll-m-20">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold tracking-tight">Projects 專案清單</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    {(["active", "paused", "completed", "archived", "all"] as FilterStatus[]).map((status) => (
                                        <Button
                                            key={status}
                                            variant={filterStatus === status ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setFilterStatus(status)}
                                            className="h-7 px-3 text-xs capitalize"
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
                                <Plus className="h-4 w-4" />
                                New Project
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 px-6 pb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        {...project}
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            <CreateProjectModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleCreateProject}
                areas={areas}
            />
        </div>
    )
}
