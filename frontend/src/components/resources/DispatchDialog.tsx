import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Check, Folder, Layers, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DispatchDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (selectedIds: string[]) => void
}

// Mock Data for Projects and Areas
const MOCK_PROJECTS = [
    { id: "p1", name: "Kernel Development", type: "project" },
    { id: "p2", name: "Home Renovation", type: "project" },
    { id: "p3", name: "Fitness Goal 2026", type: "project" },
]

const MOCK_AREAS = [
    { id: "a1", name: "Work", type: "area" },
    { id: "a2", name: "Personal", type: "area" },
    { id: "a3", name: "Health", type: "area" },
]

export function DispatchDialog({
    isOpen,
    onOpenChange,
    onConfirm,
}: DispatchDialogProps) {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    const handleConfirm = () => {
        onConfirm(selectedIds)
        onOpenChange(false)
        setSelectedIds([])
    }

    const selectedItems = [...MOCK_PROJECTS, ...MOCK_AREAS].filter(item => selectedIds.includes(item.id))

    return (
        <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
            <div className="flex flex-col h-full max-h-[85vh]">
                <CommandInput placeholder="搜尋專案或領域..." />

                {selectedIds.length > 0 && (
                    <div className="px-4 py-2 border-b flex flex-wrap gap-2 items-center bg-muted/20">
                        <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider mr-1">已選擇:</span>
                        {selectedItems.map(item => (
                            <Badge key={item.id} variant="secondary" className="pl-2 pr-1 gap-1 py-1 rounded-lg bg-primary/10 text-primary border-primary/20">
                                {item.name}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        toggleSelection(item.id)
                                    }}
                                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                <CommandList className="flex-1">
                    <CommandEmpty>找不到相符的項目。</CommandEmpty>
                    <CommandGroup heading="Projects">
                        {MOCK_PROJECTS.map((project) => (
                            <CommandItem
                                key={project.id}
                                onSelect={() => toggleSelection(project.id)}
                                className="flex items-center justify-between py-3 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-primary/60" />
                                    <span className="font-medium text-sm">{project.name}</span>
                                </div>
                                {selectedIds.includes(project.id) && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Areas">
                        {MOCK_AREAS.map((area) => (
                            <CommandItem
                                key={area.id}
                                onSelect={() => toggleSelection(area.id)}
                                className="flex items-center justify-between py-3 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-blue-500/60" />
                                    <span className="font-medium text-sm">{area.name}</span>
                                </div>
                                {
                                    selectedIds.includes(area.id) && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )
                                }
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>

                <div className="p-4 border-t bg-muted/30 flex items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        選擇完成後點擊確認以將資源關聯至目標並標記為 Processed。
                    </p>
                    <Button
                        onClick={handleConfirm}
                        disabled={selectedIds.length === 0}
                        className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                        確認分流
                    </Button>
                </div>
            </div >
        </CommandDialog >
    )
}
