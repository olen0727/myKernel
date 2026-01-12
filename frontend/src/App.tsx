import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

function App() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

            <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
                <TopBar />

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

export default App
