import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { CommandPalette } from "@/components/command-palette"
import { QuickCaptureModal } from "@/components/quick-capture-modal"
import { Toaster } from "@/components/ui/sonner"
import { useQuickCapture } from "@/stores/quick-capture-store"
import { useEffect } from "react"

import { useAuth } from "@/providers/AuthProvider"
import { Navigate, useLocation } from "react-router-dom"

export default function AppLayout() {
    const { user, isLoading } = useAuth()
    const location = useLocation()
    const { toggle } = useQuickCapture()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                toggle()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [toggle])

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-background text-foreground">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Common UI Elements */}
            <CommandPalette />
            <QuickCaptureModal />
            <Toaster position="top-center" expand={true} richColors />

            {/* Desktop Sidebar */}
            <Sidebar />

            <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
                <TopBar />

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
