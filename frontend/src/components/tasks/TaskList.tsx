import * as React from "react"
import { MoreVertical, Plus, Trash2, Edit2 } from "lucide-react"
import { TaskItemProps } from "@/components/tasks/TaskItem"
import { SortableTaskItem } from "@/components/tasks/SortableTaskItem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

export interface TaskListProps {
    id: string
    title: string
    items: TaskItemProps[]
    onTaskToggle: (listId: string, taskId: string) => void
    onTaskTitleChange: (listId: string, taskId: string, newTitle: string) => void
    onTaskUrgencyChange?: (listId: string, taskId: string, urgency: 'orange' | 'red' | null) => void
    onTaskTomatoesChange?: (listId: string, taskId: string, tomatoes: number) => void
    onAddTask: (listId: string, title: string, urgency?: 'orange' | 'red' | null, tomatoes?: number) => void
    onRenameList: (listId: string, newTitle: string) => void
    onDeleteList: (listId: string) => void
    onDeleteTask: (listId: string, taskId: string) => void
}

export function TaskList({
    id,
    title,
    items,
    onTaskToggle,
    onTaskTitleChange,
    onTaskUrgencyChange,
    onTaskTomatoesChange,
    onAddTask,
    onRenameList,
    onDeleteList,
    onDeleteTask,
}: TaskListProps) {
    const [isEditingTitle, setIsEditingTitle] = React.useState(false)
    const [localTitle, setLocalTitle] = React.useState(title)
    const [isAddingTask, setIsAddingTask] = React.useState(false)
    const [newTaskTitle, setNewTaskTitle] = React.useState("")
    const [newTaskUrgency, setNewTaskUrgency] = React.useState<'orange' | 'red' | null>(null)
    const [newTaskTomatoes, setNewTaskTomatoes] = React.useState(1)

    const { setNodeRef, isOver } = useDroppable({
        id: id,
    })

    const handleTitleBlur = () => {
        setIsEditingTitle(false)
        if (localTitle !== title) {
            onRenameList(id, localTitle)
        }
    }

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            onAddTask(id, newTaskTitle.trim(), newTaskUrgency, newTaskTomatoes)
            setNewTaskTitle("")
            setNewTaskUrgency(null)
            setNewTaskTomatoes(1)
            // Do not close adding task (setIsAddingTask(false)) because user might want to add multiple consecutively
        } else {
            setIsAddingTask(false)
        }
    }

    const handleAddTaskKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddTask()
            setIsAddingTask(true)
        } else if (e.key === "Escape") {
            setIsAddingTask(false)
            setNewTaskTitle("")
        }
    }

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "space-y-4 p-4 rounded-xl transition-colors",
                isOver && "bg-accent/20"
            )}
        >
            <div className="flex items-center justify-between group/list">
                {isEditingTitle ? (
                    <Input
                        className="h-8 font-semibold text-base py-1 px-2 w-[200px]"
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
                        autoFocus
                    />
                ) : (
                    <h3
                        className="font-semibold text-base cursor-text hover:bg-muted/50 px-2 -ml-2 rounded py-1"
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {title}
                    </h3>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover/list:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            重新命名
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onDeleteList(id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            刪除清單
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-1">
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((task) => (
                        <SortableTaskItem
                            key={task.id}
                            {...task}
                            showProject={false}
                            onToggle={(taskId) => onTaskToggle(id, taskId)}
                            onTitleChange={(taskId, newTitle) => onTaskTitleChange(id, taskId, newTitle)}
                            onUrgencyChange={(taskId, urgency) => onTaskUrgencyChange?.(id, taskId, urgency)}
                            onTomatoesChange={(taskId, tomatoes) => onTaskTomatoesChange?.(id, taskId, tomatoes)}
                            onDelete={(taskId) => onDeleteTask(id, taskId)}
                        />
                    ))}
                </SortableContext>

                {isAddingTask ? (
                    <div className="flex items-center gap-2 p-1.5 pl-10 border border-border/50 rounded-md bg-muted/20">
                        <Input
                            className="flex-1 h-7 text-sm py-1 px-2 border-none bg-transparent focus-visible:ring-0 shadow-none"
                            placeholder="任務名稱..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onBlur={handleAddTask}
                            onKeyDown={handleAddTaskKeyDown}
                            autoFocus
                        />
                        <div className="flex items-center gap-3 shrink-0 pr-1" onPointerDown={(e) => e.preventDefault()}>
                            <button
                                type="button"
                                onClick={() => setNewTaskUrgency(u => u === null ? 'orange' : u === 'orange' ? 'red' : null)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-colors",
                                    newTaskUrgency === 'red' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                        newTaskUrgency === 'orange' ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" :
                                            "border border-muted-foreground/30 hover:bg-muted-foreground/20 bg-background"
                                )}
                                title="設定緊急程度"
                            />
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setNewTaskTomatoes(v)}
                                        className={cn(
                                            "text-[10px] transition-all",
                                            newTaskTomatoes >= v ? "opacity-100 scale-100" : "opacity-30 scale-90 grayscale hover:grayscale-0 hover:opacity-70"
                                        )}
                                        title={`${v} 顆番茄`}
                                    >
                                        🍅
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-muted-foreground hover:text-primary gap-2 h-9 px-2 pl-10"
                        onClick={() => setIsAddingTask(true)}
                    >
                        <Plus className="h-4 w-4" />
                        新增任務
                    </Button>
                )}
            </div>
        </div>
    )
}
