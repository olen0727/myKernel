import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { HabitHeatmap } from "../HabitHeatmap"

// 由於測試環境 (jsdom) 與 Radix Tooltip 可能存在兼容性問題導致 Invalid hook call
// 我們 Mock 掉 Tooltip 組件，以確保測試專注於元件本身的邏輯與渲染

vi.mock("@/components/ui/tooltip", () => ({
    Tooltip: ({ children }: any) => <div>{children}</div>,
    TooltipTrigger: ({ children }: any) => <div>{children}</div>,
    TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
    TooltipProvider: ({ children }: any) => <div>{children}</div>,
}))

describe("HabitHeatmap", () => {
    it("renders the heatmap container", () => {
        render(<HabitHeatmap />)
        expect(screen.getByTestId("habit-heatmap")).toBeInTheDocument()
    })

    it("renders habits and streaks", () => {
        render(<HabitHeatmap />)
        expect(screen.getAllByTestId("streak-current").length).toBeGreaterThan(0)
        expect(screen.getAllByTestId("streak-max").length).toBeGreaterThan(0)
    })

    it("renders unified X-axis week labels", () => {
        render(<HabitHeatmap />)
        expect(screen.getAllByTestId("week-label").length).toBeGreaterThan(0)
    })
})
