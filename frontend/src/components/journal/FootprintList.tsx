
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { dataStore, ResourceFootprint } from "@/services/mock-data-service"
import { cn } from "@/lib/utils"
import { FileText, Link as LinkIcon, NotebookPen, ExternalLink } from "lucide-react"

interface FootprintListProps {
    date: Date
}

export function FootprintList({ date }: FootprintListProps) {
    const navigate = useNavigate()
    const [footprints, setFootprints] = useState<ResourceFootprint[]>([])
    const dateStr = format(date, "yyyy-MM-dd")

    useEffect(() => {
        const data = dataStore.getResourceFootprints(dateStr)
        setFootprints(data)
    }, [dateStr])

    if (footprints.length === 0) {
        return (
            <div className="p-4 border rounded-lg bg-muted/20 h-32 flex items-center justify-center text-muted-foreground">
                無資源足跡
            </div>
        )
    }

    const getIcon = (type: ResourceFootprint["type"]) => {
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




    const handleItemClick = (fp: ResourceFootprint) => {
        if (fp.type === 'journal') {
            // Already on journal page, maybe focus editor?
            // For now, do nothing or maybe expand logic later.
            return
        }
        navigate(`/resources/${fp.id}`)
    }

    return (
        <div className="space-y-3">
            {footprints.map((fp) => (
                <div
                    key={fp.id}
                    className="border rounded-lg p-3 flex items-start gap-3 bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                    onClick={() => handleItemClick(fp)}
                >
                    <div className="mt-1 text-muted-foreground group-hover:text-primary transition-colors">
                        {getIcon(fp.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-medium text-sm truncate">{fp.title}</h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(fp.timestamp, "HH:mm")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider",
                                    fp.action === "created"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                                )}
                            >
                                {fp.action}
                            </span>
                            {fp.summary && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {fp.summary}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                </div>
            ))}
        </div>
    )
}
