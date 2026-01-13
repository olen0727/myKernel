import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Workbench } from "@/components/projects/Workbench"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { cn } from "@/lib/utils"

const INITIAL_PROJECTS: ProjectCardProps[] = [
    { id: "1", name: "Kernel Project", area: "Work", status: "active", doneTasks: 8, totalTasks: 12 },
    { id: "2", name: "Fitness Tracker", area: "Personal", status: "active", doneTasks: 2, totalTasks: 5 },
    { id: "3", name: "Smart Home API", area: "Side Project", status: "paused", doneTasks: 3, totalTasks: 8 },
    { id: "4", name: "Marketing Campaign", area: "Work", status: "active", doneTasks: 15, totalTasks: 20 },
    { id: "5", name: "Vacation Planning", area: "Personal", status: "completed", doneTasks: 10, totalTasks: 10 },
]

type FilterStatus = "all" | "active" | "completed" | "paused"

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
        // 模擬導航至詳情頁
        navigate(`/projects/${newProject.id}`)
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            <div className="flex flex-col h-full">
                {/* Top: Workbench */}
                <div className="h-[40%] min-h-[300px] border-b">
                    <Workbench />
                </div>

                {/* Bottom: Project List */}
                <div className="flex-1 overflow-hidden bg-muted/5 flex flex-col">
                    <div className="flex items-center justify-between px-6 py-6">
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

                    <ScrollArea className="flex-1 px-6 pb-6">
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
            </div>

            <CreateProjectModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleCreateProject}
            />
        </div>
    )
}
