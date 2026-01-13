import { Sidebar, SidebarContent } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

function App() {
    return (

        <div className="flex min-h-screen bg-background text-foreground font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
                <TopBar />

                {/* Mobile Menu Trigger */}
                <div className="md:hidden p-4 border-b flex items-center gap-3">
                    <SidebarMobileTrigger />
                    <span className="font-serif font-bold">Kernel</span>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-8 flex flex-col items-center justify-start gap-6">
                    <h1 className="text-4xl font-serif font-medium tracking-tight mt-10">Welcome to Kernel</h1>
                    <p className="text-muted-foreground">Select an item from the sidebar to get started.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                        <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                            <h3 className="font-serif font-medium text-lg mb-2">Projects</h3>
                            <p className="text-sm text-muted-foreground">Manage your active projects and tasks.</p>
                        </div>
                        <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                            <h3 className="font-serif font-medium text-lg mb-2">Inbox</h3>
                            <p className="text-sm text-muted-foreground">Capture thoughts and process incoming tasks.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function SidebarMobileTrigger() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <SidebarContent forceExpanded />
            </SheetContent>
        </Sheet>
    )
}

export default App
