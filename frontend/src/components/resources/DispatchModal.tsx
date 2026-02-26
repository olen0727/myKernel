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
import { DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Check, Folder, Layers, X, MoveHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { services, ProjectService, AreaService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { Project, Area } from "@/types/models"

export interface DispatchItem {
    id: string
    name: string
    type: "project" | "area"
}

interface DispatchModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (selectedItems: DispatchItem[]) => void
    initialSelected?: DispatchItem[]
}

export function DispatchModal({
    isOpen,
    onOpenChange,
    onConfirm,
    initialSelected = [],
}: DispatchModalProps) {
    const [selectedIds, setSelectedIds] = React.useState<string[]>(
        initialSelected.map(item => item.id)
    )

    const [projectService, setProjectService] = React.useState<ProjectService | undefined>()
    const [areaService, setAreaService] = React.useState<AreaService | undefined>()

    React.useEffect(() => {
        const load = async () => {
            setProjectService(await services.project)
            setAreaService(await services.area)
        }
        load()
    }, [])

    const projects$ = React.useMemo(() => projectService?.getAll$(), [projectService])
    const areas$ = React.useMemo(() => areaService?.getAll$(), [areaService])

    const dbProjects = useObservable<Project[]>(projects$, []) || []
    const dbAreas = useObservable<Area[]>(areas$, []) || []

    const mappedProjects: DispatchItem[] = React.useMemo(() =>
        dbProjects.map(p => ({ id: p.id, name: p.name, type: "project" })), [dbProjects])

    const mappedAreas: DispatchItem[] = React.useMemo(() =>
        dbAreas.map(a => ({ id: a.id, name: a.name, type: "area" })), [dbAreas])

    const allItems = React.useMemo(() => [...mappedProjects, ...mappedAreas], [mappedProjects, mappedAreas])

    // L1: Reset state when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setSelectedIds(initialSelected.map(item => item.id))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    const handleConfirm = () => {
        // Return full item objects, not just IDs
        const selectedItems = allItems.filter(item => selectedIds.includes(item.id))
        onConfirm(selectedItems)
        onOpenChange(false)
    }

    // L1: Handle close - reset state
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedIds([])
        }
        onOpenChange(open)
    }

    const selectedItems = allItems.filter(item => selectedIds.includes(item.id))

    return (
        <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
            <div className="px-4 pt-4 pb-2 border-b bg-muted/5 flex items-center justify-between">
                <div className="space-y-0.5">
                    <DialogTitle className="text-sm font-black flex items-center gap-2 tracking-tight">
                        <MoveHorizontal className="w-3.5 h-3.5 text-primary" />
                        資源分流與關聯
                    </DialogTitle>
                    <DialogDescription className="text-[10px] text-muted-foreground font-medium">
                        將此資源分類至 PARA 系統中的專案或領域
                    </DialogDescription>
                </div>
            </div>
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
                        {mappedProjects.map((project) => (
                            <CommandItem
                                key={project.id}
                                value={project.name}
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
                        {mappedAreas.map((area) => (
                            <CommandItem
                                key={area.id}
                                value={area.name}
                                onSelect={() => toggleSelection(area.id)}
                                className="flex items-center justify-between py-3 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-blue-500/60" />
                                    <span className="font-medium text-sm">{area.name}</span>
                                </div>
                                {selectedIds.includes(area.id) && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
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
            </div>
        </CommandDialog>
    )
}
