import { useSidebarStore } from "@/stores/sidebar-store"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Inbox,
    Layout,
    Layers,
    BookOpen,
    PenTool,
    Settings,
    ChevronLeft,
    PlusCircle,
    Activity,
    FileText,
    Folder,
    ChevronDown
} from "lucide-react"

export function Sidebar() {
    const { isCollapsed, toggleSidebar } = useSidebarStore()

    return (
        <aside
            className={cn(
                "group relative hidden md:flex flex-col items-center border-r bg-background transition-[width] duration-300 ease-in-out h-screen py-4",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <SidebarContent />

            {/* Collapse Toggle - Desktop Only */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={toggleSidebar}
            >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
            </Button>
        </aside>
    )
}

interface SidebarContentProps {
    forceExpanded?: boolean
}

export function SidebarContent({ forceExpanded = false }: SidebarContentProps) {
    const { isCollapsed: storeCollapsed } = useSidebarStore()
    const isCollapsed = forceExpanded ? false : storeCollapsed

    const navItems = [
        { icon: Inbox, label: "Inbox", href: "/inbox", count: 3 },
        { icon: Layout, label: "Projects", href: "/projects" },
        { icon: Layers, label: "Areas", href: "/areas" },
        { icon: BookOpen, label: "Resources", href: "/resources" },
        { icon: Activity, label: "Metrics", href: "/metrics" },
        { icon: PenTool, label: "Journal", href: "/journal" },
    ]

    const recentItems = [
        { icon: Folder, label: "Kernel Development", type: "Project" },
        { icon: FileText, label: "UX Research Note", type: "Resource" },
        { icon: Layers, label: "Personal Growth", type: "Area" },
    ]

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-col w-full h-full items-center">
                {/* Logo Area */}
                <NavLink to="/inbox" className={cn("flex items-center justify-center w-full mb-6 h-10 transition-all", isCollapsed ? "px-2" : "px-6")}>
                    {isCollapsed ? (
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold font-serif cursor-pointer">K</div>
                    ) : (
                        <span className="text-xl font-bold font-serif tracking-tight cursor-pointer text-foreground">Kernel</span>
                    )}
                </NavLink>

                {/* Quick Capture */}
                <div className="mb-4 w-full px-2 flex justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isCollapsed ? "ghost" : "default"}
                                size={isCollapsed ? "icon" : "default"}
                                className={cn("transition-all", !isCollapsed && "w-full justify-start gap-2 shadow-sm font-medium")}
                            >
                                <PlusCircle className="h-5 w-5" />
                                {!isCollapsed && <span>New Resource</span>}
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">Quick Capture</TooltipContent>}
                    </Tooltip>
                </div>

                {/* Main Navigation */}
                <ScrollArea className="flex-1 w-full px-2">
                    <nav className="space-y-1">
                        {navItems.map((item, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <NavLink to={item.href}>
                                        {({ isActive }) => (
                                            <Button
                                                variant={isActive ? "secondary" : "ghost"}
                                                size={isCollapsed ? "icon" : "default"}
                                                className={cn(
                                                    "w-full transition-all",
                                                    isCollapsed ? "justify-center" : "justify-start gap-3 px-3",
                                                    isActive && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {!isCollapsed && (
                                                    <div className="flex flex-1 items-center justify-between">
                                                        <span>{item.label}</span>
                                                        {item.count && (
                                                            <span className="text-xs font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                                                                {item.count}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </Button>
                                        )}
                                    </NavLink>
                                </TooltipTrigger>
                                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                            </Tooltip>
                        ))}
                    </nav>

                    {/* Recent Items */}
                    {!isCollapsed && (
                        <Collapsible defaultOpen className="mt-8 px-3">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-4 w-4">
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="space-y-1">
                                {recentItems.map((item, i) => (
                                    <Button key={i} variant="ghost" size="sm" className="w-full justify-start gap-2 px-2 h-8 text-muted-foreground hover:text-foreground font-normal overflow-hidden">
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </Button>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                </ScrollArea>

                {/* Footer: User Profile & Settings */}
                <div className="mt-auto w-full px-2 pt-2">
                    {!isCollapsed && <Separator className="mb-2" />}

                    <div className={cn("flex items-center gap-2", isCollapsed ? "flex-col" : "flex-row")}>
                        {/* User Profile Trigger */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className={cn("h-12", isCollapsed ? "w-10 px-0" : "w-full justify-start gap-3 px-2")}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>OL</AvatarFallback>
                                    </Avatar>
                                    {!isCollapsed && (
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-sm font-medium">Olen</span>
                                            <span className="text-xs text-muted-foreground">Pro Plan</span>
                                        </div>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">Profile</TooltipContent>}
                        </Tooltip>

                        {/* Settings Trigger */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to="/settings">
                                    {({ isActive }) => (
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            size="icon"
                                            className={cn("text-muted-foreground hover:text-foreground", isCollapsed ? "h-10 w-10" : "h-8 w-8", isActive && "bg-accent text-accent-foreground")}
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    )}
                                </NavLink>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
                        </Tooltip>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
