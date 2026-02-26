import React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ResourceStatus = "all" | "processed" | "archived" | "inbox"

export interface FilterState {
    search: string
    status: ResourceStatus
    project: string
    tags: string[]
}

export interface FilterBarProps {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    availableTags?: string[]
    availableProjects?: { id: string; name: string }[]
}

const DEFAULT_TAGS = ["architecture", "react", "design", "frontend", "backend"]
const DEFAULT_PROJECTS = [
    { id: "all", name: "所有專案" },
    { id: "p1", name: "Project Kernel" },
]

export function FilterBar({
    filters,
    onFiltersChange,
    availableTags = DEFAULT_TAGS,
    availableProjects = DEFAULT_PROJECTS,
}: FilterBarProps) {
    const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, search: e.target.value })
    }

    const handleStatusChange = (status: string) => {
        onFiltersChange({ ...filters, status: status as ResourceStatus })
    }

    const handleProjectChange = (project: string) => {
        onFiltersChange({ ...filters, project })
    }

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag]
        onFiltersChange({ ...filters, tags: newTags })
    }

    const removeTag = (tag: string) => {
        onFiltersChange({ ...filters, tags: filters.tags.filter(t => t !== tag) })
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/20 rounded-xl border border-border/40">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜尋資源..."
                        className="pl-9 bg-background/50"
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                </div>

                <Select value={filters.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full sm:w-[160px] bg-background/50">
                        <SelectValue placeholder="狀態 Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部 All</SelectItem>
                        <SelectItem value="processed">已處理 Processed</SelectItem>
                        <SelectItem value="archived">已封存 Archived</SelectItem>
                        <SelectItem value="inbox">收件匣 Inbox</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.project} onValueChange={handleProjectChange}>
                    <SelectTrigger className="w-full sm:w-[160px] bg-background/50">
                        <SelectValue placeholder="專案/領域 Project" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableProjects.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={tagPopoverOpen}
                            className="w-full sm:w-[160px] justify-between bg-background/50 border-input font-normal"
                        >
                            {filters.tags.length > 0 ? `${filters.tags.length} 個標籤` : "標籤 Tags"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="搜尋標籤..." />
                            <CommandList>
                                <CommandEmpty>找不到標籤</CommandEmpty>
                                <CommandGroup>
                                    {availableTags.map(tag => (
                                        <CommandItem
                                            key={tag}
                                            value={tag}
                                            onSelect={() => toggleTag(tag)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    filters.tags.includes(tag) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {tag}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Selected Tags Display */}
            {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1">
                    {filters.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive transition-colors"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">移除 {tag}</span>
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
