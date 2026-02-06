import { useSidebarStore } from "@/stores/sidebar-store"
import { useQuickCapture } from "@/stores/quick-capture-store"
import { useAuth } from "@/providers/AuthProvider"
import { useInbox } from "@/hooks/use-inbox"

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
    ChevronDown,
    LogOut
} from "lucide-react"


export function Sidebar() {
    const { isCollapsed } = useSidebarStore()

    return (
        <aside
            className={cn(
                "relative hidden lg:flex flex-col border-r bg-card transition-all duration-300 ease-in-out h-screen sticky top-0",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <SidebarContent />
        </aside>
    )
}

interface SidebarContentProps {
    forceExpanded?: boolean
    onToggle?: () => void
}



import { useRecents } from "@/hooks/use-recents"

export function SidebarContent({ forceExpanded = false, onToggle }: SidebarContentProps) {
    const { isCollapsed: storeCollapsed, toggleSidebar } = useSidebarStore()
    const { onOpen } = useQuickCapture()
    const { user, logout } = useAuth()
    const isCollapsed = forceExpanded ? false : storeCollapsed

    // Fetch Inbox Data
    const { count: inboxCount } = useInbox();

    // Fetch Recent Items
    const recentItems = useRecents();

    const navItems = [
        { icon: Layout, label: "Dashboard", href: "/dashboard" },
        { icon: Inbox, label: "Inbox", href: "/inbox", count: inboxCount > 0 ? inboxCount : undefined },
        { icon: Layout, label: "Projects", href: "/projects" },
        { icon: Layers, label: "Areas", href: "/areas" },
        { icon: BookOpen, label: "Resources", href: "/resources" },
        { icon: Activity, label: "Metrics", href: "/metrics" },
        { icon: PenTool, label: "Journal", href: "/journal" },
    ]

    const handleToggle = () => {
        if (onToggle) {
            onToggle()
        } else {
            toggleSidebar()
        }
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-col w-full h-full items-center py-4">
                <div className={cn("w-full mb-6 px-2")}>
                    <Button
                        variant="ghost"
                        onClick={handleToggle}
                        className={cn(
                            "w-full h-10 flex items-center transition-all duration-200 overflow-hidden px-2",
                            isCollapsed ? "justify-center" : "justify-between gap-2"
                        )}
                    >
                        {/* PC Logic */}
                        <div className="hidden lg:flex items-center gap-2">
                            {isCollapsed ? (
                                <div className="group relative h-8 w-8 flex items-center justify-center">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold font-serif group-hover:hidden transition-all">K</div>
                                    <ChevronLeft className="h-5 w-5 transition-transform rotate-180 hidden group-hover:block text-muted-foreground" />
                                </div>
                            ) : (
                                <>
                                    <span className="text-xl font-bold font-serif tracking-tight text-foreground">Kernel</span>
                                    <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
                                </>
                            )}
                        </div>

                        {/* Mobile/Pad Logic - Same as PC expanded style for sheet */}
                        <div className="lg:hidden flex items-center justify-between w-full">
                            <span className="text-xl font-bold font-serif tracking-tight text-foreground">Kernel</span>
                            <ChevronLeft className={cn("h-4 w-4 text-muted-foreground/50 transition-transform", isCollapsed ? "rotate-180" : "rotate-0")} />
                        </div>
                    </Button>
                </div>

                {/* Quick Capture */}
                <div className="mb-4 w-full px-2 flex justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isCollapsed ? "ghost" : "default"}
                                size={isCollapsed ? "icon" : "default"}
                                onClick={onOpen}
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
                                                variant="ghost"
                                                size={isCollapsed ? "icon" : "default"}
                                                className={cn(
                                                    "w-full transition-all group",
                                                    isCollapsed ? "justify-center" : "justify-start gap-3 px-3",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {!isCollapsed && (
                                                    <div className="flex flex-1 items-center justify-between">
                                                        <span>{item.label}</span>
                                                        {item.count && (
                                                            <span className={cn(
                                                                "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-all",
                                                                isActive
                                                                    ? "bg-primary text-primary-foreground shadow-sm group-hover:bg-primary-foreground group-hover:text-primary"
                                                                    : "bg-primary/10 text-primary group-hover:bg-primary-foreground group-hover:text-primary"
                                                            )}>
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
                        <Collapsible defaultOpen className="mt-8">
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full flex items-center justify-between px-3 py-2 h-auto hover:bg-transparent group"
                                >
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                                        Recent
                                    </h4>
                                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 px-2">
                                {recentItems.map((item) => (
                                    <NavLink key={item.id} to={item.href}>
                                        {({ isActive }) => (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "w-full justify-start gap-3 px-3 h-9 font-normal overflow-hidden transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                                                        : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                                                )}
                                            >
                                                <item.icon className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                                                <span className="truncate">{item.label}</span>
                                            </Button>
                                        )}
                                    </NavLink>
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
                                        <AvatarImage src={user?.avatarUrl || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    {!isCollapsed && (
                                        <div className="flex flex-col items-start text-left shrink-0">
                                            <span className="text-sm font-medium truncate max-w-[80px]">{user?.name || "User"}</span>
                                            <span className="text-xs text-muted-foreground">{user?.plan || "Free"}</span>
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

                        {/* Logout Trigger */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={logout}
                                    className={cn("text-muted-foreground hover:text-destructive", isCollapsed ? "h-10 w-10" : "h-8 w-8")}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
                        </Tooltip>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
