import * as React from "react"
import { Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface TaskItemProps {
    id: string
    title: string
    projectName?: string
    status: 'todo' | 'doing' | 'done'
    onToggle?: (id: string) => void
    onTitleChange?: (id: string, newTitle: string) => void
    onDelete?: (id: string) => void
    showProject?: boolean
    editable?: boolean
}

export function TaskItem({
    id,
    title,
    projectName,
    status = 'todo',
    onToggle,
    onTitleChange,
    onDelete,
    showProject = true,
    editable = true,
}: TaskItemProps) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [localTitle, setLocalTitle] = React.useState(title)

    const handleBlur = () => {
        setIsEditing(false)
        if (localTitle !== title && onTitleChange) {
            onTitleChange(id, localTitle)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleBlur()
        } else if (e.key === "Escape") {
            setLocalTitle(title)
            setIsEditing(false)
        }
    }

    return (
        <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors group">
            <Checkbox
                id={`task-${id}`}
                checked={status === 'done'}
                onCheckedChange={() => onToggle?.(id)}
            />
            {isEditing && editable ? (
                <Input
                    className="flex-1 h-7 text-sm py-1 px-2"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <label
                    htmlFor={`task-${id}`}
                    className={cn(
                        "flex-1 text-sm font-medium leading-none cursor-pointer",
                        status === 'done' && "line-through text-muted-foreground"
                    )}
                    onClick={(e) => {
                        if (editable) {
                            e.preventDefault()
                            setIsEditing(true)
                        }
                    }}
                >
                    {title}
                </label>
            )}

            {showProject && projectName && (
                <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0 h-4 font-medium bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
                >
                    {projectName}
                </Badge>
            )}

            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all rounded hover:bg-destructive/10"
                    title="刪除任務"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
