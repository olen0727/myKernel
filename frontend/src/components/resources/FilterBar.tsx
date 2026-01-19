
import React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Check, ChevronsUpDown } from "lucide-react"
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
import { cn } from "@/lib/utils"

export function FilterBar() {
    const [open, setOpen] = React.useState(false)
    const [selectedTag, setSelectedTag] = React.useState("")

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/20 rounded-xl border border-border/40">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="搜尋資源..."
                    className="pl-9 bg-background/50"
                />
            </div>

            <Select defaultValue="processed">
                <SelectTrigger className="w-full sm:w-[160px] bg-background/50">
                    <SelectValue placeholder="狀態 Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">全部 All</SelectItem>
                    <SelectItem value="processed">已處理 Processed</SelectItem>
                    <SelectItem value="archived">已歸檔 Archived</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-full sm:w-[160px] bg-background/50">
                    <SelectValue placeholder="專案/領域 Project" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">所有專案</SelectItem>
                    <SelectItem value="p1">Project Kernel</SelectItem>
                </SelectContent>
            </Select>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full sm:w-[160px] justify-between bg-background/50 border-input font-normal"
                    >
                        {selectedTag ? selectedTag : "標籤 Tags"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[160px] p-0">
                    <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandList>
                            <CommandEmpty>No tag found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    value="architecture"
                                    onSelect={(currentValue) => {
                                        setSelectedTag(currentValue === selectedTag ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedTag === "architecture" ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    Architecture
                                </CommandItem>
                                <CommandItem
                                    value="react"
                                    onSelect={(currentValue) => {
                                        setSelectedTag(currentValue === selectedTag ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedTag === "react" ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    React
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
