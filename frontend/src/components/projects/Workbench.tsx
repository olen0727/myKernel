import * as React from "react"
import { TaskItem } from "@/components/tasks/TaskItem"
import { SortableTaskItem } from "@/components/tasks/SortableTaskItem"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GripVertical } from "lucide-react"
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
    useDroppable,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"

const INITIAL_DOING = [
    { id: "1", title: "完成專案列表 UI 實作", projectName: "Kernel", completed: false },
    { id: "2", title: "修復全站搜尋 Bug", projectName: "Kernel", completed: false },
]

const INITIAL_TODO = [
    { id: "3", title: "設計資料庫 Schema", projectName: "Backend API", completed: false },
    { id: "4", title: "撰寫單元測試", projectName: "Kernel", completed: false },
    { id: "5", title: "與 UI/UX 團隊對接", projectName: "Design System", completed: false },
    { id: "6", title: "研究 RxDB 分離存儲", projectName: "Kernel", completed: false },
    { id: "7", title: "更新專案文件", projectName: "Infrastructure", completed: false },
    { id: "8", title: "優化首頁載入速度", projectName: "Frontend", completed: false },
    { id: "9", title: "實作使用者權限管理", projectName: "Admin Portal", completed: false },
    { id: "10", title: "修復行動版佈局問題", projectName: "Kernel", completed: false },
]

export function Workbench() {
    const [doingTasks, setDoingTasks] = React.useState(INITIAL_DOING)
    const [todoTasks, setTodoTasks] = React.useState(INITIAL_TODO)
    const [activeId, setActiveId] = React.useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const activeTask = React.useMemo(() => {
        return [...doingTasks, ...todoTasks].find(t => t.id === activeId)
    }, [activeId, doingTasks, todoTasks])

    const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeContainer = findContainer(activeId)
        const overContainer = findContainer(overId) || overId

        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        setDoingTasks(prev => {
            if (activeContainer === "doing") return prev.filter(i => i.id !== activeId)
            if (overContainer === "doing") {
                const activeItem = todoTasks.find(i => i.id === activeId)!
                const overItems = prev
                const overIndex = overItems.findIndex(i => i.id === overId)
                const newIndex = overIndex >= 0 ? overIndex : overItems.length
                const newItems = [...prev]
                newItems.splice(newIndex, 0, activeItem)
                return newItems
            }
            return prev
        })

        setTodoTasks(prev => {
            if (activeContainer === "todo") return prev.filter(i => i.id !== activeId)
            if (overContainer === "todo") {
                const activeItem = doingTasks.find(i => i.id === activeId)!
                const overItems = prev
                const overIndex = overItems.findIndex(i => i.id === overId)
                const newIndex = overIndex >= 0 ? overIndex : overItems.length
                const newItems = [...prev]
                newItems.splice(newIndex, 0, activeItem)
                return newItems
            }
            return prev
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const activeId = active.id as string
            const overId = over.id as string
            const activeContainer = findContainer(activeId)
            const overContainer = findContainer(overId) || overId

            if (activeContainer === overContainer) {
                if (activeContainer === "doing") {
                    setDoingTasks(items => arrayMove(items, items.findIndex(i => i.id === activeId), items.findIndex(i => i.id === overId)))
                } else {
                    setTodoTasks(items => arrayMove(items, items.findIndex(i => i.id === activeId), items.findIndex(i => i.id === overId)))
                }
            }
        }
        setActiveId(null)
    }

    const handleToggleTask = (id: string) => {
        setDoingTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
        setTodoTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    }

    const handleTitleChange = (id: string, newTitle: string) => {
        setDoingTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t))
        setTodoTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t))
    }

    const findContainer = (id: string) => {
        if (id === "doing" || doingTasks.some(t => t.id === id)) return "doing"
        if (id === "todo" || todoTasks.some(t => t.id === id)) return "todo"
        return null
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-b overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                    <h2 className="text-lg font-semibold tracking-tight">Workbench 工作台</h2>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <DroppableColumn
                        id="doing"
                        title="Do Today 焦點"
                        tasks={doingTasks}
                        onToggle={handleToggleTask}
                        onTitleChange={handleTitleChange}
                    />
                    <DroppableColumn
                        id="todo"
                        title="Todo 待辦"
                        tasks={todoTasks}
                        isLast
                        onToggle={handleToggleTask}
                        onTitleChange={handleTitleChange}
                    />
                </div>
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.4',
                        },
                    },
                }),
            }}>
                {activeTask ? (
                    <div className="w-[300px] bg-background/80 backdrop-blur-md border rounded-md shadow-2xl p-2 flex items-center gap-3 scale-95 origin-center rotate-1 transition-transform cursor-grabbing ring-2 ring-primary/20">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <TaskItem {...activeTask} editable={false} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

function DroppableColumn({
    id,
    title,
    tasks,
    isLast = false,
    onToggle,
    onTitleChange
}: {
    id: string,
    title: string,
    tasks: any[],
    isLast?: boolean,
    onToggle: (id: string) => void,
    onTitleChange: (id: string, title: string) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id })

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 flex flex-col transition-colors",
                !isLast && "border-r",
                isOver && "bg-accent/10"
            )}
        >
            <div className="px-6 py-3 bg-muted/10 border-b">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-1">
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map(task => (
                            <SortableTaskItem
                                key={task.id}
                                {...task}
                                onToggle={onToggle}
                                onTitleChange={onTitleChange}
                            />
                        ))}
                    </SortableContext>
                </div>
            </ScrollArea>
        </div>
    )
}
