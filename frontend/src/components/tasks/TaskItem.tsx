import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TaskItemProps {
    id: string
    title: string
    projectName?: string
    completed?: boolean
    onToggle?: (id: string) => void
    showProject?: boolean
}

export function TaskItem({
    id,
    title,
    projectName,
    completed = false,
    onToggle,
    showProject = true,
}: TaskItemProps) {
    return (
        <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors group">
            <Checkbox
                id={`task-${id}`}
                checked={completed}
                onCheckedChange={() => onToggle?.(id)}
            />
            <label
                htmlFor={`task-${id}`}
                className={cn(
                    "flex-1 text-sm font-medium leading-none cursor-pointer",
                    completed && "line-through text-muted-foreground"
                )}
            >
                {title}
            </label>
            {showProject && projectName && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal bg-accent/20 text-accent-foreground border-accent/20">
                    {projectName}
                </Badge>
            )}
        </div>
    )
}
