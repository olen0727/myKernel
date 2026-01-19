import { render, screen } from "@testing-library/react"
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

    it("renders mock resources", () => {
        renderPage()
        expect(screen.getByText("Kernel Architecture Design")).toBeInTheDocument()
        expect(screen.getByText("React Documentation")).toBeInTheDocument()
    })
})
