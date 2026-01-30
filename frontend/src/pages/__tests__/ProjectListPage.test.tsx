import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import ProjectListPage from "../ProjectListPage"

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const mockProjects = [
        { id: '1', name: 'Kernel Project', status: 'active', areaId: 'a1' },
        { id: '2', name: 'Smart Home API', status: 'active', areaId: 'a1' }
    ];
    const mockService = {
        getAll$: () => new BehaviorSubject(mockProjects),
        create: vi.fn(),
    };
    return {
        services: {
            project: Promise.resolve(mockService),
            area: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
            task: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
        }
    };
})

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
    it("renders Workbench and Project list title", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Loading Projects...")).not.toBeInTheDocument())
        expect(screen.getByTestId("workbench")).toBeInTheDocument()
        expect(screen.getByText(/Projects 專案清單/i)).toBeInTheDocument()
    })

    it("renders mock projects", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Loading Projects...")).not.toBeInTheDocument())
        expect(screen.getByText("Kernel Project")).toBeInTheDocument()
        expect(screen.getByText("Smart Home API")).toBeInTheDocument()
    })
})
