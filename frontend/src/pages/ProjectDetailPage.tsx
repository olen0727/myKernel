import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ListTodo, FileText, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "@/components/projects/ProjectHeader"
import { ProjectSidebar } from "@/components/projects/ProjectSidebar"
import { TaskList } from "@/components/tasks/TaskList"
import { toast } from "sonner"

// --- Initial Mock Data ---
interface Task {
    id: string
    title: string
    completed: boolean
}

interface TaskListGroup {
    id: string
    title: string
    items: Task[]
}

const INITIAL_TASK_LISTS: TaskListGroup[] = [
    {
        id: "list-1",
        title: "第一階段：開發環境準備",
        items: [
            { id: "task-1", title: "初始化 React + Vite 專案", completed: true },
            { id: "task-2", title: "配置 Tailwind CSS", completed: true },
            { id: "task-3", title: "設定 Shadcn UI 組件庫", completed: false },
        ]
    },
    {
        id: "list-2",
        title: "第二階段：核心 UI 實作",
        items: [
            { id: "task-4", title: "實作專案列表頁面", completed: false },
            { id: "task-5", title: "開發專案詳情頁", completed: false },
        ]
    }
]

const INITIAL_PROJECT = {
    id: "1",
    name: "Kernel Project",
    description: "這是一個關於個人生產力系統的核心開發專案。目標是建立一個能夠完美整合筆記、任務與目標的腦同步系統。",
    area: "Work",
    status: "active" as "active" | "paused" | "completed" | "archived",
    dueDate: new Date(2026, 5, 30),
}

export default function ProjectDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [project, setProject] = React.useState(INITIAL_PROJECT)
    const [taskLists, setTaskLists] = React.useState<TaskListGroup[]>(INITIAL_TASK_LISTS)

    // --- 進度計算 ---
    const taskStats = React.useMemo(() => {
        let total = 0
        let done = 0
        taskLists.forEach(list => {
            total += list.items.length
            list.items.forEach(item => {
                if (item.completed) done++
            })
        })
        return { done, total }
    }, [taskLists])

    // --- Handlers ---
    const handleUpdateProject = (updates: Partial<typeof INITIAL_PROJECT>) => {
        setProject(prev => ({ ...prev, ...updates }))
        toast.success("專案已更新")
    }

    const handleTaskToggle = (listId: string, taskId: string) => {
        setTaskLists(prev => prev.map(list => {
            if (list.id !== listId) return list
            return {
                ...list,
                items: list.items.map(task =>
                    task.id === taskId ? { ...task, completed: !task.completed } : task
                )
            }
        }))
    }

    const handleTaskTitleChange = (listId: string, taskId: string, newTitle: string) => {
        setTaskLists(prev => prev.map(list => {
            if (list.id !== listId) return list
            return {
                ...list,
                items: list.items.map(task =>
                    task.id === taskId ? { ...task, title: newTitle } : task
                )
            }
        }))
    }

    const handleAddTask = (listId: string, title: string) => {
        const newTask = {
            id: `task-${Math.random().toString(36).substr(2, 9)}`,
            title,
            completed: false
        }
        setTaskLists(prev => prev.map(list =>
            list.id === listId ? { ...list, items: [...list.items, newTask] } : list
        ))
    }

    const handleAddList = () => {
        const newList = {
            id: `list-${Math.random().toString(36).substr(2, 9)}`,
            title: "新的任務清單",
            items: []
        }
        setTaskLists([...taskLists, newList])
    }

    const handleRenameList = (listId: string, newTitle: string) => {
        setTaskLists(prev => prev.map(list =>
            list.id === listId ? { ...list, title: newTitle } : list
        ))
    }

    const handleDeleteList = (listId: string) => {
        setTaskLists(prev => prev.filter(list => list.id !== listId))
        toast.error("清單已刪除")
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

            <div className="flex-1 overflow-hidden flex h-full">
                {/* Left Column: Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-10">
                        <ProjectHeader
                            title={project.name}
                            description={project.description}
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
                                <TabsTrigger value="docs" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    專案文件 (Docs)
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    設定
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="tasks" className="space-y-8 min-h-[400px]">
                                <div className="space-y-12">
                                    {taskLists.map(list => (
                                        <TaskList
                                            key={list.id}
                                            {...list}
                                            onTaskToggle={handleTaskToggle}
                                            onTaskTitleChange={handleTaskTitleChange}
                                            onAddTask={handleAddTask}
                                            onRenameList={handleRenameList}
                                            onDeleteList={handleDeleteList}
                                        />
                                    ))}

                                    <Button
                                        variant="outline"
                                        className="w-full border-dashed py-8 h-auto gap-2 text-muted-foreground hover:text-primary transition-all"
                                        onClick={handleAddList}
                                    >
                                        <Plus className="h-5 w-5" />
                                        新增任務群組 (Task Group)
                                    </Button>
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
                        onStatusChange={(status) => handleUpdateProject({ status })}
                        onAreaChange={(area) => handleUpdateProject({ area })}
                        onDueDateChange={(dueDate) => handleUpdateProject({ dueDate })}
                        onArchive={() => handleUpdateProject({ status: "archived" })}
                        onDelete={() => navigate("/projects")}
                    />
                </div>
            </div>
        </div>
    )
}
