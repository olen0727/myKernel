import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ListTodo, FileText, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "@/components/projects/ProjectHeader"
import { ProjectSidebar } from "@/components/projects/ProjectSidebar"
import { toast } from "sonner"

// --- Mock Data ---
const MOCK_PROJECT = {
    id: "1",
    name: "Kernel Project",
    description: "這是一個關於個人生產力系統的核心開發專案。目標是建立一個能夠完美整合筆記、任務與目標的腦同步系統。",
    area: "Work",
    status: "active" as "active" | "paused" | "completed" | "archived",
    dueDate: new Date(2026, 5, 30),
    doneTasks: 8,
    totalTasks: 12,
}

export default function ProjectDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = React.useState(MOCK_PROJECT)

    const handleUpdate = (updates: Partial<typeof MOCK_PROJECT>) => {
        setProject(prev => ({ ...prev, ...updates }))
        toast.success("專案已更新")
    }

    const handleDelete = () => {
        console.log("Deleting project:", id)
        toast.error("專案已刪除")
        navigate("/projects")
    }

    const handleArchive = () => {
        handleUpdate({ status: "archived" })
        toast.info("專案已封存")
    }

    return (
        <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
            {/* Top Navigation */}
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

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex h-full">
                {/* Left Column: Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-10">
                        <ProjectHeader
                            title={project.name}
                            description={project.description}
                            doneTasks={project.doneTasks}
                            totalTasks={project.totalTasks}
                            onTitleChange={(name) => handleUpdate({ name })}
                            onDescriptionChange={(description) => handleUpdate({ description })}
                        />

                        <Tabs defaultValue="tasks" className="w-full">
                            <TabsList className="bg-muted/30 p-1 mb-6">
                                <TabsTrigger value="tasks" className="gap-2">
                                    <ListTodo className="h-4 w-4" />
                                    任務清單 (Tasks)
                                </TabsTrigger>
                                <TabsTrigger value="docs" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    專案文件 (Docs)
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    設定
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="tasks" className="min-h-[400px]">
                                <div className="bg-muted/10 border border-dashed rounded-xl flex items-center justify-center p-12">
                                    <div className="text-center space-y-2">
                                        <p className="text-muted-foreground">任務管理模組開發中...</p>
                                        <p className="text-xs text-muted-foreground/60">(預計在 Story 3.4 實作)</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="docs" className="min-h-[400px]">
                                <div className="bg-muted/10 border border-dashed rounded-xl flex items-center justify-center p-12">
                                    <p className="text-muted-foreground">目前尚未建立相關文件。</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="min-h-[400px]">
                                <div className="bg-muted/10 border border-dashed rounded-xl flex items-center justify-center p-12">
                                    <p className="text-muted-foreground">進階設定選項實作中。</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="w-[350px] overflow-y-auto py-8 pr-8">
                    <ProjectSidebar
                        status={project.status}
                        area={project.area}
                        dueDate={project.dueDate}
                        onStatusChange={(status) => handleUpdate({ status })}
                        onAreaChange={(area) => handleUpdate({ area })}
                        onDueDateChange={(dueDate) => handleUpdate({ dueDate })}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    )
}
