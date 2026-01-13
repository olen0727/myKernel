import { Search, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useLocation, Link } from "react-router-dom"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function TopBar() {
    const location = useLocation()
    const pathnames = location.pathname.split("/").filter((x) => x)

    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            {/* Left: Dynamic Breadcrumbs */}
            <div className="flex items-center gap-2 mr-4">
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
                                <div key={to} className="flex items-center">
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
                                </div>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Center: Global Search (Command Palette Trigger) */}
            <div className="flex-1 flex justify-center max-w-2xl mx-auto">
                <Button
                    variant="outline"
                    className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-96 lg:w-[32rem] shadow-sm bg-muted/20 hover:bg-muted/50 transition-colors"
                    onClick={() => console.log("Open command palette")}
                >
                    <Search className="mr-2 h-4 w-4" />
                    <span>Search or ask...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-1.5 h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 ml-4 w-[100px] justify-end">
                <ModeToggle />
            </div>
        </header>
    )
}
