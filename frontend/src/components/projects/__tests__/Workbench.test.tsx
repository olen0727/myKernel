import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Workbench } from "../Workbench"

// Mock ScrollArea to avoid testing internal shadcn components
vi.mock("@/components/ui/scroll-area", () => ({
    ScrollArea: ({ children }: any) => <div>{children}</div>
}))

describe("Workbench", () => {
    it("renders both columns", () => {
        render(<Workbench />)
        expect(screen.getByText(/Do Today/i)).toBeInTheDocument()
        expect(screen.getByText(/Todo/i)).toBeInTheDocument()
    })

    it("renders mock tasks", () => {
        render(<Workbench />)
        // Check for some mock task titles
        expect(screen.getByText("完成專案列表 UI 實作")).toBeInTheDocument()
        expect(screen.getByText("設計資料庫 Schema")).toBeInTheDocument()
    })
})
