
import { useState, useEffect, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricDialog } from "@/components/metrics/MetricDialog"
import { MetricList } from "@/components/metrics/MetricList"
import { services, MetricService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { Metric } from "@/types/models"
import { toast } from "sonner"

export default function MetricsPage() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingMetric, setEditingMetric] = useState<Metric | undefined>(undefined)

    const [metricService, setMetricService] = useState<MetricService | undefined>();

    useEffect(() => {
        const load = async () => {
            setMetricService(await services.metric);
        };
        load();
    }, []);

    const metrics$ = useMemo(() => metricService?.getAll$(), [metricService]);
    const metrics = useObservable<Metric[]>(metrics$, []) || [];

    const handleCreate = () => {
        setEditingMetric(undefined)
        setDialogOpen(true)
    }

    const handleEdit = (metric: Metric) => {
        setEditingMetric(metric)
        setDialogOpen(true)
    }

    const handleArchive = async (id: string, currentStatus: string | undefined) => {
        if (!metricService) return;
        try {
            // @ts-ignore - status is not in base Metric type yet but we are using it
            await metricService.update(id, { status: currentStatus === 'active' ? 'archived' : 'active' } as any);
        } catch (e) {
            toast.error("Failed to update status");
        }
    }

    const handleDelete = async (id: string) => {
        if (!metricService) return;
        try {
            await metricService.delete(id);
            toast.success("Metric deleted");
        } catch (e) {
            toast.error("Failed to delete metric");
        }
    }

    const handleSubmit = async (values: any) => {
        if (!metricService) return;
        try {
            if (editingMetric) {
                await metricService.update(editingMetric.id, values);
                toast.success("Metric updated");
            } else {
                await metricService.create({
                    ...values,
                    status: 'active'
                });
                toast.success("Metric created");
            }
        } catch (e) {
            console.error(e);
            toast.error("Operation failed");
        }
    }

    // @ts-ignore
    const activeMetrics = metrics.filter(m => (m.status || 'active') === 'active')
    // @ts-ignore
    const archivedMetrics = metrics.filter(m => m.status === 'archived')

    if (!metricService) return <div>Loading Metrics...</div>

    return (
        <div className="container max-w-4xl py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Metrics</h1>
                    <p className="text-muted-foreground">Manage your custom tracking metrics.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New Metric
                </Button>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                        value="active"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Active ({activeMetrics.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="archived"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Archived ({archivedMetrics.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-6">
                    <MetricList
                        metrics={activeMetrics}
                        onUpdate={() => { }}
                        onEdit={handleEdit}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                    />
                </TabsContent>
                <TabsContent value="archived" className="mt-6">
                    <MetricList
                        metrics={archivedMetrics}
                        onUpdate={() => { }}
                        onEdit={handleEdit}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                    />
                </TabsContent>
            </Tabs>

            <MetricDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                metricToEdit={editingMetric}
            />
        </div>
    )
}
