import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
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
