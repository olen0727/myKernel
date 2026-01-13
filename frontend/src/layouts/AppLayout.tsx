import { Outlet } from "react-router-dom"
import { Sidebar, SidebarContent } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { CommandPalette } from "@/components/command-palette"

export default function AppLayout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Command Palette */}
            <CommandPalette />

            {/* Desktop Sidebar */}

            <Sidebar />

            <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
                <TopBar />

                {/* Mobile Menu Trigger */}
                <div className="md:hidden p-4 border-b flex items-center gap-3">
                    <SidebarMobileTrigger />
                    <span className="font-serif font-bold">Kernel</span>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
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
