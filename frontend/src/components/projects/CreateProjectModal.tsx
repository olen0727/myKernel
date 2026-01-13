import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "專案名稱至少需要 2 個字元。",
    }),
    area: z.string().optional(),
    dueDate: z.string().optional(),
})

interface CreateProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<z.infer<typeof formSchema>>
}

export function CreateProjectModal({
    open,
    onOpenChange,
    onSubmit,
    defaultValues,
}: CreateProjectModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            area: "",
            dueDate: "",
            ...defaultValues,
        },
    })

    // Reset form when modal opens with new defaultValues
    React.useEffect(() => {
        if (open) {
            form.reset({
                name: "",
                area: "",
                dueDate: "",
                ...defaultValues,
            })
        }
    }, [open, defaultValues, form])

    function handleInternalSubmit(values: z.infer<typeof formSchema>) {
        onSubmit(values)
        form.reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>建立新專案</DialogTitle>
                    <DialogDescription>
                        填寫以下資訊來建立一個新的專案。
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>專案名稱</FormLabel>
                                    <FormControl>
                                        <Input placeholder="例如：核心系統開發..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>所屬區域 (Area)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="例如：Work, Personal..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>截止日期 (Due Date)</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                取消
                            </Button>
                            <Button type="submit">建立專案</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
