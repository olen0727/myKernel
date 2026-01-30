import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import ProjectDetailPage from "../ProjectDetailPage"

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const mockProject = { id: '1', name: 'Kernel Project', status: 'active', description: 'desc' };
    const mockTasksUpdated = [
        { id: 't1', title: '第一階段：開發環境準備', completed: true, projectId: '1' },
        { id: 't2', title: '第二階段：核心 UI 實作', completed: true, projectId: '1' },
        { id: 't3', title: 'Task 3', completed: false, projectId: '1' },
        { id: 't4', title: 'Task 4', completed: false, projectId: '1' },
        { id: 't5', title: 'Task 5', completed: false, projectId: '1' },
    ];

    const mockServiceProject = {
        getById$: () => new BehaviorSubject(mockProject),
        update: vi.fn(),
        delete: vi.fn(),
    };
    const mockServiceTask = {
        getByProject$: () => new BehaviorSubject(mockTasksUpdated),
        update: vi.fn(),
        create: vi.fn(),
    };

    const mockServiceResource = {
        getAll$: () => new BehaviorSubject([
            { id: 'r1', title: 'Res 1', type: 'note', projectId: '1' }
        ])
    };

    return {
        services: {
            project: Promise.resolve(mockServiceProject),
            task: Promise.resolve(mockServiceTask),
            area: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
            resource: Promise.resolve(mockServiceResource),
        }
    };
})

// Mock sonner toast
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

const renderWithRouter = (initialRoute = "/projects/1") => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/projects" element={<div>Project List</div>} />
            </Routes>
        </MemoryRouter>
    )
}

describe("ProjectDetailPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders project header with title and progress", async () => {
        renderWithRouter()

        await waitFor(() => expect(screen.queryByText("Kernel Project")).toBeInTheDocument());

        expect(screen.getAllByText("Kernel Project").length).toBeGreaterThan(0)
        expect(screen.getByText(/2 \/ 5 任務已完成/)).toBeInTheDocument()
    })

    it("renders breadcrumb navigation", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Kernel Project")).toBeInTheDocument());
        expect(screen.getByText("Projects")).toBeInTheDocument()
    })

    it("renders task lists with mock data", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Kernel Project")).toBeInTheDocument());

        expect(screen.getByText("第一階段：開發環境準備")).toBeInTheDocument()
        expect(screen.getByText("第二階段：核心 UI 實作")).toBeInTheDocument()
    })

    it("renders sidebar with project metadata", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Kernel Project")).toBeInTheDocument());
        expect(screen.getByText("目前狀態")).toBeInTheDocument()
        expect(screen.getByText("專案領域 (Area)")).toBeInTheDocument()
    })

    it("renders tabs for Tasks and Resources", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Kernel Project")).toBeInTheDocument());
        expect(screen.getByText("任務清單 (Tasks)")).toBeInTheDocument()
        expect(screen.getByText("專案資源 (Resources)")).toBeInTheDocument()
    })

    it("calculates progress correctly", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Kernel Project")).toBeInTheDocument());
        expect(screen.getByText("2 / 5 任務已完成")).toBeInTheDocument()
    })

    it("toggles task completion status", async () => {
        renderWithRouter()
        await waitFor(() => expect(screen.queryByText("Kernel Project")).toBeInTheDocument());

        const checkboxes = screen.getAllByRole("checkbox")
        expect(checkboxes.length).toBeGreaterThan(0)

        const firstCheckbox = checkboxes[0]
        fireEvent.click(firstCheckbox)
    })
})
