import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { TaskItem, TaskItemProps } from "@/components/tasks/TaskItem"
import { cn } from "@/lib/utils"

interface SortableTaskItemProps extends TaskItemProps {
    id: string
}

export function SortableTaskItem(props: SortableTaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative flex items-center group",
                isDragging && "opacity-50 z-50 shadow-lg bg-accent/50 rounded-md"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-muted-foreground"
            >
                <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 -ml-1">
                <TaskItem {...props} />
            </div>
        </div>
    )
}
