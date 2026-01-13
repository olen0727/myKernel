import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Workbench } from "@/components/projects/Workbench"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"

const INITIAL_PROJECTS: ProjectCardProps[] = [
    { id: "1", name: "Kernel Project", area: "Work", status: "active", doneTasks: 8, totalTasks: 12 },
    { id: "2", name: "Fitness Tracker", area: "Personal", status: "active", doneTasks: 2, totalTasks: 5 },
    { id: "3", name: "Smart Home API", area: "Side Project", status: "paused", doneTasks: 3, totalTasks: 8 },
    { id: "4", name: "Marketing Campaign", area: "Work", status: "active", doneTasks: 15, totalTasks: 20 },
    { id: "5", name: "Vacation Planning", area: "Personal", status: "completed", doneTasks: 10, totalTasks: 10 },
]

type FilterStatus = "all" | "active" | "completed" | "paused"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function ProjectListPage() {
    const navigate = useNavigate()
    const [projects, setProjects] = useState<ProjectCardProps[]>(INITIAL_PROJECTS)
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredProjects = projects.filter(project => {
        if (filterStatus === "all") return true
        return project.status === filterStatus
    })

    const handleCreateProject = (values: any) => {
        const newProject: ProjectCardProps = {
            id: Math.random().toString(36).substr(2, 9),
            name: values.name,
            area: values.area || "General",
            status: "active",
            doneTasks: 0,
            totalTasks: 0,
        }
        setProjects([newProject, ...projects])
        navigate(`/projects/${newProject.id}`)
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
                                    {(["all", "active", "paused", "completed"] as FilterStatus[]).map((status) => (
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
            />
        </div>
    )
}
