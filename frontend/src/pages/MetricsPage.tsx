
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricDialog } from "@/components/metrics/MetricDialog"
import { MetricList } from "@/components/metrics/MetricList"
import { dataStore, MetricDefinition } from "@/services/mock-data-service"

export default function MetricsPage() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingMetric, setEditingMetric] = useState<MetricDefinition | undefined>(undefined)
    const [metrics, setMetrics] = useState<MetricDefinition[]>([])

    const loadMetrics = () => {
        setMetrics([...dataStore.getMetricDefinitions()])
    }

    useEffect(() => {
        loadMetrics()
    }, [])

    const handleCreate = () => {
        setEditingMetric(undefined)
        setDialogOpen(true)
    }

    const handleEdit = (metric: MetricDefinition) => {
        setEditingMetric(metric)
        setDialogOpen(true)
    }

    const activeMetrics = metrics.filter(m => m.status === 'active')
    const archivedMetrics = metrics.filter(m => m.status === 'archived')

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
                    <MetricList metrics={activeMetrics} onUpdate={loadMetrics} onEdit={handleEdit} />
                </TabsContent>
                <TabsContent value="archived" className="mt-6">
                    <MetricList metrics={archivedMetrics} onUpdate={loadMetrics} onEdit={handleEdit} />
                </TabsContent>
            </Tabs>

            <MetricDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={loadMetrics}
                metricToEdit={editingMetric}
            />
        </div>
    )
}
