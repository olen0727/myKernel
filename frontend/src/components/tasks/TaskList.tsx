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
    onAddTask: (listId: string, title: string) => void
    onRenameList: (listId: string, newTitle: string) => void
    onDeleteList: (listId: string) => void
}

export function TaskList({
    id,
    title,
    items,
    onTaskToggle,
    onTaskTitleChange,
    onAddTask,
    onRenameList,
    onDeleteList,
}: TaskListProps) {
    const [isEditingTitle, setIsEditingTitle] = React.useState(false)
    const [localTitle, setLocalTitle] = React.useState(title)
    const [isAddingTask, setIsAddingTask] = React.useState(false)
    const [newTaskTitle, setNewTaskTitle] = React.useState("")

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
            onAddTask(id, newTaskTitle.trim())
            setNewTaskTitle("")
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
                        />
                    ))}
                </SortableContext>

                {isAddingTask ? (
                    <div className="flex items-center gap-3 p-2 pl-10">
                        <Input
                            className="flex-1 h-7 text-sm py-1 px-2"
                            placeholder="任務名稱..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onBlur={handleAddTask}
                            onKeyDown={handleAddTaskKeyDown}
                            autoFocus
                        />
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
