
import { useState } from "react"
import { Metric } from "@/types/models"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Archive, Trash2, Undo2, Pencil } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MetricListProps {
    metrics: (Metric & { status?: string, isSystem?: boolean, unit?: string, options?: string[] })[]
    onUpdate: () => void
    onArchive: (id: string, status: string | undefined) => void
    onDelete: (id: string) => void
    onEdit: (metric: Metric) => void
}

export function MetricList({ metrics, onUpdate, onEdit, onArchive, onDelete }: MetricListProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)

    if (metrics.length === 0) return <div className="text-muted-foreground p-4 text-center border rounded-lg border-dashed">No metrics found.</div>

    const handleArchive = (id: string, currentStatus: string | undefined) => {
        onArchive(id, currentStatus)
    }

    const confirmDelete = () => {
        if (deleteId) {
            onDelete(deleteId)
            setDeleteId(null)
        }
    }

    return (
        <div className="space-y-3">
            {metrics.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium flex items-center gap-2">
                            {m.name}
                            {m.isSystem && <Badge variant="secondary" className="text-[10px] h-5">System</Badge>}
                        </span>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="capitalize bg-muted px-1.5 py-0.5 rounded">{m.type}</span>
                            {m.unit && <span>Unit: {m.unit}</span>}
                            {m.options && <span>Options: {m.options.join(', ')}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {!m.isSystem && m.status === 'active' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(m)}
                                title="Edit"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleArchive(m.id, m.status)}
                            title={m.status === 'active' ? "Archive" : "Restore"}
                        >
                            {m.status === 'active' ? <Archive className="h-4 w-4" /> : <Undo2 className="h-4 w-4" />}
                        </Button>

                        {!m.isSystem && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteId(m.id)}
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the metric and all its recorded data history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
