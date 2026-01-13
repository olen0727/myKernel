import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ProjectHeaderProps {
    title: string
    description: string
    doneTasks: number
    totalTasks: number
    onTitleChange: (title: string) => void
    onDescriptionChange: (description: string) => void
}

export function ProjectHeader({
    title,
    description,
    doneTasks,
    totalTasks,
    onTitleChange,
    onDescriptionChange,
}: ProjectHeaderProps) {
    const [isEditingTitle, setIsEditingTitle] = React.useState(false)
    const [localTitle, setLocalTitle] = React.useState(title)
    const [isEditingDesc, setIsEditingDesc] = React.useState(false)
    const [localDesc, setLocalDesc] = React.useState(description)

    const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0

    const handleTitleBlur = () => {
        setIsEditingTitle(false)
        if (localTitle !== title) {
            onTitleChange(localTitle)
        }
    }

    const handleDescBlur = () => {
        setIsEditingDesc(false)
        if (localDesc !== description) {
            onDescriptionChange(localDesc)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                {isEditingTitle ? (
                    <Input
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        autoFocus
                        className="text-3xl font-bold tracking-tight h-auto py-1 px-2 -ml-2"
                    />
                ) : (
                    <h1
                        className="text-3xl font-bold tracking-tight cursor-text hover:bg-muted/50 rounded px-2 -ml-2 py-1 transition-colors"
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {title || "未命名專案"}
                    </h1>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>專案進度</span>
                    <span className="font-medium">{doneTasks} / {totalTasks} 任務已完成</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">專案摘要</h3>
                {isEditingDesc ? (
                    <Textarea
                        value={localDesc}
                        onChange={(e) => setLocalDesc(e.target.value)}
                        onBlur={handleDescBlur}
                        autoFocus
                        placeholder="點擊新增專案描述..."
                        className="min-h-[100px] text-base"
                    />
                ) : (
                    <div
                        className={cn(
                            "text-base leading-relaxed cursor-text hover:bg-muted/50 rounded p-2 -ml-2 min-h-[40px] transition-colors",
                            !description && "text-muted-foreground italic"
                        )}
                        onClick={() => setIsEditingDesc(true)}
                    >
                        {description || "點擊新增專案描述..."}
                    </div>
                )}
            </div>
        </div>
    )
}
