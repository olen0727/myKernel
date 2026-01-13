import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { BrowserRouter } from "react-router-dom"
import InboxPage from "../InboxPage"

// Mock Shadcn/Radix components to avoid hook issues in jsdom
vi.mock("@/components/ui/scroll-area", () => ({
    ScrollArea: ({ children, className }: any) => <div className={className}>{children}</div>
}))

vi.mock("@/components/ui/context-menu", () => ({
    ContextMenu: ({ children }: any) => <div>{children}</div>,
    ContextMenuTrigger: ({ children }: any) => <div>{children}</div>,
    ContextMenuContent: ({ children }: any) => <div>{children}</div>,
    ContextMenuItem: ({ children }: any) => <div>{children}</div>,
    ContextMenuSeparator: () => <hr />,
}))

describe("InboxPage", () => {
    const renderPage = () => render(
        <BrowserRouter>
            <InboxPage />
        </BrowserRouter>
    )

    it("renders the inbox title and correct resource count", () => {
        renderPage()
        expect(screen.getByText(/收件匣 Inbox/i)).toBeInTheDocument()
        // Mock data has 4 items
        expect(screen.getByText(/4/i)).toBeInTheDocument()
    })

    it("renders resource items with correct titles", () => {
        renderPage()
        expect(screen.getByText("Kernel 產品核心理念筆記")).toBeInTheDocument()
        expect(screen.getByText("Building a Second Brain - Tiago Forte")).toBeInTheDocument()
    })

    it("removes an item when archived", () => {
        renderPage()
        const initialCount = screen.getAllByTestId("resource-item").length

        // Find archive button on first item
        const archiveButtons = screen.getAllByTitle("歸檔")
        fireEvent.click(archiveButtons[0])

        expect(screen.getAllByTestId("resource-item").length).toBe(initialCount - 1)
    })

    it("shows empty state when all items are deleted", () => {
        renderPage()

        // Delete all items
        const deleteButtons = screen.getAllByTitle("刪除")
        deleteButtons.forEach(btn => fireEvent.click(btn))

        expect(screen.getByText(/Inbox 已清空/i)).toBeInTheDocument()
    })
})
