import * as React from "react"
import { Trash2 } from "lucide-react"

const TomatoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 3v4" />
        <path d="M12 7c-2 0-4-1-5-2" />
        <path d="M12 7c2 0 4-1 5-2" />
        <path d="M12 7c-1 2-1 3-1.5 4" />
        <path d="M12 7c1 2 1 3 1.5 4" />
        <path d="M7.5 12a5 5 0 0 1 1.5-3" />
    </svg>
)
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface TaskItemProps {
    id: string
    title: string
    projectName?: string
    status: 'todo' | 'doing' | 'done'
    urgency?: 'orange' | 'red' | null
    tomatoes?: number
    onToggle?: (id: string) => void
    onTitleChange?: (id: string, newTitle: string) => void
    onDelete?: (id: string) => void
    onUrgencyChange?: (id: string, urgency: 'orange' | 'red' | null) => void
    onTomatoesChange?: (id: string, tomatoes: number) => void
    showProject?: boolean
    editable?: boolean
    isWorkbench?: boolean
}

export function TaskItem({
    id,
    title,
    projectName,
    status = 'todo',
    urgency = null,
    tomatoes = 1,
    onToggle,
    onTitleChange,
    onDelete,
    onUrgencyChange,
    onTomatoesChange,
    showProject = true,
    editable = true,
    isWorkbench = false,
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

            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (!editable) return;
                        const next = urgency === null ? 'orange' : urgency === 'orange' ? 'red' : null;
                        onUrgencyChange?.(id, next);
                    }}
                    className={cn(
                        "w-2.5 h-2.5 rounded-full transition-colors shrink-0",
                        urgency === 'red' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                            urgency === 'orange' ? "bg-[#ff9500] shadow-[0_0_8px_rgba(255,149,0,0.5)]" :
                                editable ? "border border-muted-foreground/30 hover:bg-muted-foreground/20" : "opacity-0"
                    )}
                    title="切換緊急程度 (無 -> 橘 -> 紅)"
                    disabled={!editable}
                />

                {isWorkbench ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap bg-muted/30 px-1.5 py-0.5 rounded">
                        <TomatoIcon className="w-3.5 h-3.5 text-primary fill-primary/20" />
                        <span className="font-medium">x {tomatoes}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(v => (
                            <button
                                key={v}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (editable) onTomatoesChange?.(id, v);
                                }}
                                disabled={!editable}
                                className={cn(
                                    "transition-all",
                                    tomatoes >= v ? "text-primary opacity-100 scale-100" : "text-muted-foreground opacity-30 scale-90 hover:opacity-70 hover:text-primary/70"
                                )}
                            >
                                <TomatoIcon className={cn("w-3.5 h-3.5", tomatoes >= v ? "fill-primary/20" : "fill-none opacity-60 grayscale")} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showProject && projectName && (
                <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 font-medium bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors shrink-0 max-w-[100px] truncate"
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
