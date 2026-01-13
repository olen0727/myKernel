import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ListTodo, Library, Plus, GripVertical, FileText, Link as LinkIcon } from "lucide-react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "@/components/projects/ProjectHeader"
import { ProjectSidebar } from "@/components/projects/ProjectSidebar"
import { TaskList } from "@/components/tasks/TaskList"
import { toast } from "sonner"

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
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { TaskItem } from "@/components/tasks/TaskItem"

// --- Types ---
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

// Mock linked resources for this project
interface ProjectResource {
    id: string
    type: "note" | "link"
    title: string
    content: string
    createdAt: Date
}

const INITIAL_RESOURCES: ProjectResource[] = [
    {
        id: "res-1",
        type: "note",
        title: "專案架構設計筆記",
        content: "本專案採用 React + Vite 作為前端框架，使用 RxDB 作為本地資料庫實現離線優先架構。UI 元件庫選用 Shadcn/UI，搭配 Tailwind CSS 進行樣式管理...",
        createdAt: new Date(2026, 0, 10),
    },
    {
        id: "res-2",
        type: "link",
        title: "Shadcn/UI 官方文件",
        content: "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
        createdAt: new Date(2026, 0, 8),
    },
    {
        id: "res-3",
        type: "note",
        title: "用戶訪談紀錄 - 第一輪",
        content: "訪談對象：5 位目標用戶。主要發現：用戶普遍對現有任務管理工具感到不滿，主要痛點包括：1) 跨裝置同步困難 2) 介面過於複雜 3) 缺乏彈性的組織方式...",
        createdAt: new Date(2026, 0, 5),
    },
]

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    // TODO: Epic 6 - Use id to fetch project from RxDB
    // Currently using mock data, id will be used when service layer is implemented
    const _projectId = id

    const [project, setProject] = React.useState(INITIAL_PROJECT)
    const [taskLists, setTaskLists] = React.useState<TaskListGroup[]>(INITIAL_TASK_LISTS)
    const [activeId, setActiveId] = React.useState<string | null>(null)

    // --- Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 避免點擊 Inline Edit 時誤發送拖曳
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const activeTask = React.useMemo(() => {
        if (!activeId) return null
        for (const list of taskLists) {
            const task = list.items.find(i => i.id === activeId)
            if (task) return task
        }
        return null
    }, [activeId, taskLists])

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

    // --- DnD Handlers ---
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        // 尋找 active 和 over 所在的容器
        const activeContainer = findContainer(activeId)
        const overContainer = findContainer(overId) || overId // overId 可能是容器 ID

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }

        setTaskLists((prev) => {
            const activeItems = prev.find(l => l.id === activeContainer)?.items || []
            const overItems = prev.find(l => l.id === overContainer)?.items || []

            const activeIndex = activeItems.findIndex(i => i.id === activeId)
            const overIndex = overItems.findIndex(i => i.id === overId)

            let newIndex
            if (prev.some(l => l.id === overId)) {
                // 拖曳到空的容器上
                newIndex = overItems.length
            } else {
                const isBelowLastItem = over && overIndex === overItems.length - 1
                const modifier = isBelowLastItem ? 1 : 0
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length
            }

            const movedItem = activeItems[activeIndex]

            return prev.map(list => {
                if (list.id === activeContainer) {
                    return { ...list, items: list.items.filter(i => i.id !== activeId) }
                }
                if (list.id === overContainer) {
                    const newItems = [...list.items]
                    newItems.splice(newIndex, 0, movedItem)
                    return { ...list, items: newItems }
                }
                return list
            })
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const activeContainer = findContainer(active.id as string)
            const overContainer = findContainer(over.id as string) || (over.id as string)

            if (activeContainer === overContainer) {
                setTaskLists((prev) => prev.map(list => {
                    if (list.id === activeContainer) {
                        const oldIndex = list.items.findIndex(i => i.id === active.id)
                        const newIndex = list.items.findIndex(i => i.id === over.id)
                        return {
                            ...list,
                            items: arrayMove(list.items, oldIndex, newIndex)
                        }
                    }
                    return list
                }))
            }
        }

        setActiveId(null)
    }

    const findContainer = (id: string) => {
        if (taskLists.some(l => l.id === id)) return id
        return taskLists.find(l => l.items.some(i => i.id === id))?.id
    }

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
                                            className="w-full border-dashed py-8 h-auto gap-2 text-muted-foreground hover:text-primary transition-all mt-6"
                                            onClick={handleAddList}
                                        >
                                            <Plus className="h-5 w-5" />
                                            新增任務群組 (Task Group)
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="resources" className="min-h-[400px]">
                                    {INITIAL_RESOURCES.length > 0 ? (
                                        <div className="space-y-3">
                                            {INITIAL_RESOURCES.map((resource) => (
                                                <div
                                                    key={resource.id}
                                                    className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer"
                                                >
                                                    <div className={`mt-0.5 p-2.5 rounded-lg flex items-center justify-center ${
                                                        resource.type === "note"
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
                                                            {resource.content}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground/60 mt-2">
                                                            建立於 {format(resource.createdAt, "yyyy/MM/dd", { locale: zhTW })}
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
                            area={project.area}
                            dueDate={project.dueDate}
                            onStatusChange={(status) => handleUpdateProject({ status })}
                            onAreaChange={(area: string) => handleUpdateProject({ area })}
                            onDueDateChange={(dueDate: Date | undefined) => handleUpdateProject({ dueDate })}
                            onArchive={() => handleUpdateProject({ status: "archived" })}
                            onDelete={() => navigate("/projects")}
                        />
                    </div>
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
        </DndContext>
    )
}
