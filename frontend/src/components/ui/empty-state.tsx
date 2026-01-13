import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
    className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
    className
}) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-muted/50 bg-muted/5 animate-in fade-in zoom-in duration-500",
            className
        )}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-8 ring-primary/5">
                <Icon className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed mb-8">
                {description}
            </p>
            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </div>
    )
}
