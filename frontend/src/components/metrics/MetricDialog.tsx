
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, MetricDefinition } from "@/services/mock-data-service"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["number", "rating", "select", "time"]),
    unit: z.string().optional(),
    optionsStr: z.string().optional()
})

interface MetricDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    metricToEdit?: MetricDefinition
}

export function MetricDialog({ open, onOpenChange, onSuccess, metricToEdit }: MetricDialogProps) {
    const isEditing = !!metricToEdit

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "number",
            unit: "",
            optionsStr: ""
        }
    })

    // Reset form when metricToEdit changes
    useEffect(() => {
        if (open) {
            if (metricToEdit) {
                form.reset({
                    name: metricToEdit.name,
                    type: metricToEdit.type,
                    unit: metricToEdit.unit || "",
                    optionsStr: metricToEdit.options ? metricToEdit.options.join(", ") : ""
                })
            } else {
                form.reset({
                    name: "",
                    type: "number",
                    unit: "",
                    optionsStr: ""
                })
            }
        }
    }, [metricToEdit, open, form])

    const type = form.watch("type")

    function onSubmit(values: z.infer<typeof formSchema>) {
        const commonData = {
            name: values.name,
            type: values.type,
            unit: values.type === 'number' ? values.unit : undefined,
            options: values.type === 'select' && values.optionsStr
                ? values.optionsStr.split(',').map(s => s.trim()).filter(Boolean)
                : undefined,
            min: values.type === 'rating' ? 1 : undefined,
            max: values.type === 'rating' ? 5 : undefined,
        }

        if (isEditing && metricToEdit) {
            dataStore.updateMetricDefinition(metricToEdit.id, commonData)
        } else {
            const newMetric: MetricDefinition = {
                id: crypto.randomUUID(),
                status: "active",
                isSystem: false,
                ...commonData
            }
            dataStore.addMetricDefinition(newMetric)
        }

        form.reset()
        onSuccess()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Metric" : "Create Metric"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Metric Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isEditing} // Often changing type of existing metric is dangerous/complex, let's keep it simple or allow? 
                                    // Requirement didn't say disable, but "data loss" warning was in AC. 
                                    // Let's allow it but the warning AC was for DELETE.
                                    // "Given 自定義指標，Then 可編輯或刪除 (需顯示資料遺失警告)。" -> Applies to Edit too potentially.
                                    // For now I will enable it, complexity 3.
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="rating">Rating</SelectItem>
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="time">Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {type === 'number' && (
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. min, kg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {type === 'select' && (
                            <FormField
                                control={form.control}
                                name="optionsStr"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Options (Comma separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Option 1, Option 2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button type="submit">{isEditing ? "Save Changes" : "Create"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
