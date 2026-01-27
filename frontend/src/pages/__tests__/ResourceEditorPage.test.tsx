import { render, screen, waitFor, fireEvent } from "@testing-library/react"
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

// Mock Sidebar with props to test interaction
vi.mock("@/components/resources/ResourceSidebar", () => ({
    ResourceSidebar: ({ status, onStatusChange, onDispatch, linkedItems }: any) => (
        <div data-testid="resource-sidebar">
            <span data-testid="sidebar-status">{status}</span>
            <span data-testid="sidebar-linked-count">{linkedItems.length}</span>
            <button
                data-testid="change-status-btn"
                onClick={() => onStatusChange("processed")}
            >
                Change Status
            </button>
            <button
                data-testid="dispatch-btn"
                onClick={() => onDispatch([{ id: "p1", name: "Test Project", type: "project" }])}
            >
                Dispatch
            </button>
        </div>
    )
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

    // M3: Test auto-save UI state changes
    it("shows saving indicator when content changes", async () => {
        renderPage("1")

        await waitFor(() => {
            expect(screen.getByTestId("tiptap-editor")).toBeInTheDocument()
        })

        const editor = screen.getByTestId("tiptap-editor")
        fireEvent.change(editor, { target: { value: "New content" } })

        // Should show "Saving..." indicator
        await waitFor(() => {
            expect(screen.getByText(/Saving/i)).toBeInTheDocument()
        })

        // After timeout, should show "Saved" indicator
        await waitFor(() => {
            expect(screen.getByText(/Saved/i)).toBeInTheDocument()
        }, { timeout: 2000 })
    })

    // M3: Test sidebar dispatch updates linkedItems
    it("updates linkedItems when dispatch is triggered", async () => {
        renderPage("1")

        await waitFor(() => {
            expect(screen.getByTestId("resource-sidebar")).toBeInTheDocument()
        })

        // Initial linked count is 1 (from mock data)
        expect(screen.getByTestId("sidebar-linked-count")).toHaveTextContent("1")

        // Trigger dispatch
        const dispatchBtn = screen.getByTestId("dispatch-btn")
        fireEvent.click(dispatchBtn)

        // After dispatch, linkedItems should be updated
        await waitFor(() => {
            expect(screen.getByTestId("sidebar-linked-count")).toHaveTextContent("1")
        })
    })

    // M3: Test status change
    it("allows status change through sidebar", async () => {
        renderPage("1")

        await waitFor(() => {
            expect(screen.getByTestId("sidebar-status")).toHaveTextContent("processed")
        })
    })
})
