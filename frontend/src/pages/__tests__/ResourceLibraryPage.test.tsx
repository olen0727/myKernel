import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { BrowserRouter } from "react-router-dom"
import ResourceLibraryPage from "../ResourceLibraryPage"

vi.mock("@/components/ui/scroll-area", () => ({
    ScrollArea: ({ children, className }: any) => <div className={className}>{children}</div>
}))

describe("ResourceLibraryPage", () => {
    const renderPage = () => render(
        <BrowserRouter>
            <ResourceLibraryPage />
        </BrowserRouter>
    )

    it("renders the library title", () => {
        renderPage()
        expect(screen.getByText(/資源庫 Resource Library/i)).toBeInTheDocument()
    })

    it("renders the filter bar", () => {
        renderPage()
        expect(screen.getByPlaceholderText(/搜尋資源/i)).toBeInTheDocument()
        expect(screen.getByText(/已處理 Processed/i)).toBeInTheDocument()
    })

    it("renders mock resources with processed status by default", () => {
        renderPage()
        // Default filter is "processed", so we should see processed items
        expect(screen.getByText("Kernel Architecture Design")).toBeInTheDocument()
        expect(screen.getByText("React Documentation")).toBeInTheDocument()
    })

    // M2: Test filtering by search
    it("filters resources by search text", () => {
        renderPage()
        const searchInput = screen.getByPlaceholderText(/搜尋資源/i)

        // Search for "Kernel"
        fireEvent.change(searchInput, { target: { value: "Kernel" } })

        // Should show Kernel Architecture Design
        expect(screen.getByText("Kernel Architecture Design")).toBeInTheDocument()
        // React Documentation should be filtered out
        expect(screen.queryByText("React Documentation")).not.toBeInTheDocument()
    })

    it("shows empty state when no resources match filter", () => {
        renderPage()
        const searchInput = screen.getByPlaceholderText(/搜尋資源/i)

        // Search for something that doesn't exist
        fireEvent.change(searchInput, { target: { value: "nonexistent123" } })

        expect(screen.getByText(/沒有符合的資源/i)).toBeInTheDocument()
    })

    // M2: Test context badges are displayed
    it("displays context badges for linked items and tags", () => {
        renderPage()
        // Kernel Architecture Design has linkedItems and tags
        expect(screen.getByText(/Kernel Development/i)).toBeInTheDocument()
        expect(screen.getByText(/#architecture/i)).toBeInTheDocument()
    })
})
