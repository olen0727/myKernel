import { format } from "date-fns"
import { Calendar as CalendarIcon, Trash2, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type ProjectStatus = "active" | "paused" | "completed" | "archived"

import { Area } from "@/types/models"

// ... imports

interface ProjectSidebarProps {
    projectName: string
    status: ProjectStatus
    area: string
    dueDate?: Date
    onStatusChange: (status: ProjectStatus) => void
    onAreaChange: (area: string) => void
    onDueDateChange: (date?: Date) => void
    onArchive: () => void
    onDelete: () => void
    areas: Area[]
}

export function ProjectSidebar({
    projectName: _projectName,
    status,
    area,
    dueDate,
    onStatusChange,
    onAreaChange,
    onDueDateChange,
    onArchive,
    onDelete,
    areas,
}: ProjectSidebarProps) {
    return (
        <div className="space-y-8 h-full border-l pl-8">
            {/* Status Section */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">目前狀態</h3>
                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    status === "active" ? "bg-green-500" :
                                        status === "paused" ? "bg-amber-500" :
                                            status === "completed" ? "bg-blue-500" : "bg-gray-400"
                                )} />
                                <span className="capitalize">{status}</span>
                            </div>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Due Date Section */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">截止日期</h3>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !dueDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "yyyy/MM/dd") : <span>設定截止日期</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={onDueDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Area Section */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">專案領域 (Area)</h3>
                <Select value={area} onValueChange={onAreaChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="選擇領域..." />
                    </SelectTrigger>
                    <SelectContent>
                        {areas.map(a => (
                            <SelectItem key={a.id} value={a.id}>
                                {a.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 危險區域 */}
            <div className="pt-8 space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-primary"
                    onClick={onArchive}
                >
                    <Archive className="h-4 w-4" />
                    封存專案 (Archive)
                </Button>

                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={onDelete}
                >
                    <Trash2 className="h-4 w-4" />
                    刪除專案 (Delete)
                </Button>
            </div>
        </div>
    )
}
