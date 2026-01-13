import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    Inbox,
    Layout,
    Layers,
    Settings,
    FileText,
    Folder,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useCommandStore } from "@/stores/command-store"

export function CommandPalette() {
    const navigate = useNavigate()
    const { isOpen, setOpen } = useCommandStore()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(!isOpen)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [isOpen, setOpen])

    const runCommand = React.useCallback(
        (command: () => void) => {
            setOpen(false)
            command()
        },
        [setOpen]
    )

    return (
        <CommandDialog open={isOpen} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem onSelect={() => runCommand(() => navigate("/inbox"))}>
                        <Inbox className="mr-2 h-4 w-4" />
                        <span>Inbox</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
                        <Layout className="mr-2 h-4 w-4" />
                        <span>Projects</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/areas"))}>
                        <Layers className="mr-2 h-4 w-4" />
                        <span>Areas</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Recent Projects">
                    <CommandItem onSelect={() => runCommand(() => navigate("/projects/kernel"))}>
                        <Folder className="mr-2 h-4 w-4" />
                        <span>Kernel Development</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Recent Resources">
                    <CommandItem onSelect={() => runCommand(() => navigate("/resources/ux-notes"))}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>UX Research Notes</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
