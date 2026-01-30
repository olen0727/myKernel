import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { services } from "@/services"
import { toast } from "sonner"
import { Download, Database } from "lucide-react"

export function DataManagementSettings() {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const db = await services.getDb()
            const data = await db.exportJSON()

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `kernel-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast.success("Database exported successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to export database")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export your data for backup or migration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Database className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium">Export Data</h4>
                        <p className="text-sm text-muted-foreground">Download a JSON file containing all your workspace data.</p>
                    </div>
                    <Button onClick={handleExport} disabled={isExporting} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? "Exporting..." : "Export JSON"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
