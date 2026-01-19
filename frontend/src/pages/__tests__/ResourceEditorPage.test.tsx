import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import ResourceEditorPage from "../ResourceEditorPage"

// Mock TipTap
vi.mock("@/components/editor/TipTapEditor", () => ({
    TipTapEditor: ({ content, onChange }: any) => (
        <textarea
            data-testid="tiptap-editor"
            defaultValue={content}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}))

// Mock Sidebar
vi.mock("@/components/resources/ResourceSidebar", () => ({
    ResourceSidebar: () => <div data-testid="resource-sidebar">Sidebar</div>
}))

describe("ResourceEditorPage", () => {
    const renderPage = (id = "1") => render(
        <MemoryRouter initialEntries={[`/resources/${id}`]}>
            <Routes>
                <Route path="/resources/:id" element={<ResourceEditorPage />} />
            </Routes>
        </MemoryRouter>
    )

    it("renders the editor with title", async () => {
        renderPage("1")
        await waitFor(() => {
            expect(screen.getByDisplayValue("Kernel Architecture Design")).toBeInTheDocument()
        })
        expect(screen.getByTestId("tiptap-editor")).toBeInTheDocument()
        expect(screen.getByTestId("resource-sidebar")).toBeInTheDocument()
    })

    it("shows loading state for unknown id or fetching", () => {
        renderPage("999")
        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })
})
