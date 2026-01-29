import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const shortcuts = [
    { key: "Ctrl/Cmd + Q", description: "Quick Capture" },
    { key: "Ctrl/Cmd + K", description: "Global Search" },
    { key: "Ctrl/Cmd + [", description: "Previous Day" },
    { key: "Ctrl/Cmd + ]", description: "Next Day" },
]

export function ShortcutList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>View available keyboard shortcuts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {shortcuts.map((shortcut) => (
                        <div key={shortcut.key} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <span className="text-sm font-medium text-foreground">{shortcut.description}</span>
                            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-100">
                                {shortcut.key}
                            </kbd>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
