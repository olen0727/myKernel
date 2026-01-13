import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import ProjectListPage from "../ProjectListPage"

// Mock Workbench and Resizable
vi.mock("@/components/projects/Workbench", () => ({
    Workbench: () => <div data-testid="workbench">Workbench</div>
}))

vi.mock("@/components/ui/resizable", () => ({
    ResizablePanelGroup: ({ children }: any) => <div>{children}</div>,
    ResizablePanel: ({ children }: any) => <div>{children}</div>,
    ResizableHandle: () => <div>Handle</div>
}))

vi.mock("@/components/ui/scroll-area", () => ({
    ScrollArea: ({ children }: any) => <div>{children}</div>
}))

const renderWithRouter = () => {
    return render(
        <MemoryRouter>
            <ProjectListPage />
        </MemoryRouter>
    )
}

describe("ProjectListPage", () => {
    it("renders Workbench and Project list title", () => {
        renderWithRouter()
        expect(screen.getByTestId("workbench")).toBeInTheDocument()
        expect(screen.getByText(/Projects 專案清單/i)).toBeInTheDocument()
    })

    it("renders mock projects", () => {
        renderWithRouter()
        expect(screen.getByText("Kernel Project")).toBeInTheDocument()
        expect(screen.getByText("Smart Home API")).toBeInTheDocument()
    })
})
