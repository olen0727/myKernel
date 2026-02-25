import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { FileText, Link as LinkIcon, NotebookPen, CheckCircle2 } from "lucide-react"
import { services, ResourceService, TaskService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { Resource, Task } from "@/types/models"

const TomatoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M5 13a7 7 0 1 0 14 0c0-5 0-7-7-7s-7 2-7 7z" />
        <path d="M12 2v4" />
        <path d="M8.5 4.5l3.5 1.5 3.5-1.5" />
    </svg>
)

interface FootprintListProps {
    date: Date
}

export function FootprintList({ date }: FootprintListProps) {
    const navigate = useNavigate()
    const [resourceService, setResourceService] = useState<ResourceService | undefined>();
    const [taskService, setTaskService] = useState<TaskService | undefined>();

    useEffect(() => {
        const load = async () => {
            setResourceService(await services.resource);
            setTaskService(await services.task);
        };
        load();
    }, []);

    const allResources$ = useMemo(() => resourceService?.getAll$(), [resourceService]);
    const allResources = useObservable<Resource[]>(allResources$, []) || [];

    const allTasks$ = useMemo(() => taskService?.getAll$(), [taskService]);
    const allTasks = useObservable<Task[]>(allTasks$, []) || [];

    const footprints = useMemo(() => {
        return allResources.filter(r => {
            const time = r.updatedAt || r.createdAt;
            return time && isSameDay(new Date(time), date);
        }).map(r => {
            const isCreated = r.createdAt && isSameDay(new Date(r.createdAt), date);
            return {
                id: r.id,
                title: r.title,
                type: r.type,
                timestamp: new Date(r.updatedAt || r.createdAt || Date.now()),
                action: isCreated ? 'created' : 'edited',
                summary: r.content
            };
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [allResources, date]);

    const completedTasks = useMemo(() => {
        return allTasks.filter(t => t.completedAt && isSameDay(new Date(t.completedAt), date))
            .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    }, [allTasks, date]);

    const totalTomatoes = useMemo(() => {
        return completedTasks.reduce((sum, task) => sum + (task.tomatoes || 1), 0);
    }, [completedTasks]);

    if (!resourceService || !taskService) return <div className="p-4 text-center text-muted-foreground text-xs">Loading Footprints...</div>;

    if (footprints.length === 0 && completedTasks.length === 0) {
        return (
            <div className="p-4 border rounded-lg bg-muted/20 h-32 flex items-center justify-center text-muted-foreground">
                無足跡紀錄
            </div>
        )
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "note":
                return <FileText className="h-4 w-4" />
            case "link":
                return <LinkIcon className="h-4 w-4" />
            case "journal":
                return <NotebookPen className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    const handleItemClick = (fp: any) => {
        if (fp.type === 'journal') {
            return
        }
        navigate(`/resources/${fp.id}`)
    }

    return (
        <div className="space-y-6">
            {completedTasks.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        完成任務 <span className="ml-[6px] text-xs font-normal inline-flex items-center gap-1">task x {completedTasks.length} (<TomatoIcon className="w-3.5 h-3.5 fill-primary/20 text-primary" /> x {totalTomatoes})</span>
                    </h3>
                    <div className="space-y-2">
                        {completedTasks.map(task => (
                            <div key={task.id} className="border rounded-lg p-2 flex items-start gap-3 bg-card hover:bg-accent/50 transition-colors">
                                <div className="text-emerald-500">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <label className="text-xs truncate">{task.title}</label>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {format(new Date(task.completedAt!), "HH:mm")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {footprints.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">資源足跡</h3>
                    <div className="space-y-2">
                        {footprints.map((fp) => (
                            <div
                                key={fp.id + fp.action}
                                className="border rounded-lg p-2 flex items-start gap-3 bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                                onClick={() => handleItemClick(fp)}
                            >
                                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                    {getIcon(fp.type)}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <label className="text-xs truncate cursor-pointer">{fp.title}</label>
                                        <span
                                            className={cn(
                                                "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider shrink-0",
                                                fp.action === "created"
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                                            )}
                                        >
                                            {fp.action}
                                        </span>
                                    </div>
                                    {fp.summary && (
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            {fp.summary}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
