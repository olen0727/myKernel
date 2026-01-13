import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface ProjectCardProps {
    id: string
    name: string
    area: string
    status: "active" | "paused" | "completed" | "archived"
    doneTasks: number
    totalTasks: number
    onClick?: () => void
}

export function ProjectCard({
    name,
    area,
    status,
    doneTasks,
    totalTasks,
    onClick
}: ProjectCardProps) {
    const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0

    return (
        <Card
            className="group hover:shadow-md transition-all cursor-pointer border-muted/50"
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {name}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit text-[10px] h-4 px-1 shadow-none">
                        {area}
                    </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{doneTasks}/{totalTasks} tasks</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                </div>

                <div className="flex items-center gap-2">
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        status === "active" ? "bg-green-500" :
                            status === "paused" ? "bg-amber-500" :
                                status === "completed" ? "bg-blue-500" : "bg-gray-400"
                    )} />
                    <span className="text-xs text-muted-foreground capitalize">{status}</span>
                </div>
            </CardContent>
        </Card>
    )
}
