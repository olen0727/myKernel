import { Search, Home, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useLocation, Link } from "react-router-dom"
import { useCommandStore } from "@/stores/command-store"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/layout/Sidebar"
import * as React from "react"

export function TopBar() {
    const location = useLocation()
    const pathnames = location.pathname.split("/").filter((x) => x)
    const setOpen = useCommandStore((state) => state.setOpen)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Close sheet when navigation occurs
    React.useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 gap-2 lg:gap-4">
            {/* Left: Mobile Menu Trigger (Mobile/Pad) */}
            <div className="lg:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarContent
                            forceExpanded
                            onToggle={() => setIsMobileMenuOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Left: Dynamic Breadcrumbs (Tablet & Desktop) */}
            <div className="hidden md:flex items-center gap-2">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/inbox" className="flex items-center gap-1">
                                    <Home className="h-3.5 w-3.5" />
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {pathnames.length > 0 && <BreadcrumbSeparator />}
                        {pathnames.map((value, index) => {
                            const last = index === pathnames.length - 1
                            const to = `/${pathnames.slice(0, index + 1).join("/")}`
                            const label = value.charAt(0).toUpperCase() + value.slice(1)

                            return (
                                <React.Fragment key={to}>
                                    <BreadcrumbItem>
                                        {last ? (
                                            <BreadcrumbPage>{label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link to={to}>{label}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!last && <BreadcrumbSeparator />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Center: Global Search (Command Palette Trigger) */}
            <div className="flex-1 flex justify-center">
                <Button
                    variant="outline"
                    className="relative h-9 w-full lg:w-96 xl:w-[32rem] justify-start rounded-[0.5rem] text-sm text-muted-foreground shadow-sm bg-muted/20 hover:bg-muted/50 transition-colors px-3"
                    onClick={() => setOpen(true)}
                >
                    <Search className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">Search or ask...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-1.5 h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end">
                <ModeToggle />
            </div>
        </header>
    )
}
