import * as React from "react"
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

/**
 * 解決 Vite/ESM 環境下對 react-resizable-panels 的解析問題
 * 該庫在某些環境下可能會將組件放在 .default 中，或者直接作為屬性
 */
const getComponent = (key: string) => {
    const RP = ResizablePrimitive as any;
    return RP[key] || (RP.default && RP.default[key]);
};

const ResizablePanelGroup = ({
    className,
    ...props
}: React.ComponentProps<any>) => {
    const Component = getComponent("PanelGroup");

    if (!Component) {
        console.error("Resizable Resource Error: PanelGroup not found", ResizablePrimitive);
        return <div className={cn("flex h-full w-full", className)}>{props.children}</div>;
    }

    return (
        <Component
            className={cn(
                "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
                className
            )}
            {...props}
        />
    );
};

const ResizablePanel = (props: React.ComponentProps<any>) => {
    const Component = getComponent("Panel");
    if (!Component) return <div className="flex-1 overflow-hidden">{props.children}</div>;
    return <Component {...props} />;
};

const ResizableHandle = ({
    withHandle,
    className,
    ...props
}: React.ComponentProps<any> & {
    withHandle?: boolean
}) => {
    const Component = getComponent("PanelResizeHandle");

    if (!Component) {
        return <div className={cn("bg-border", className)} />;
    }

    return (
        <Component
            className={cn(
                "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:inset-x-0 data-[panel-group-direction=vertical]:after:top-1/2 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:-translate-y-1/2",
                className
            )}
            {...props}
        >
            {withHandle && (
                <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
                    <GripVertical className="h-2.5 w-2.5" />
                </div>
            )}
        </Component>
    );
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
