import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { BrowserRouter } from "react-router-dom"
import InboxPage from "../InboxPage"

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const initialResources = [
        { id: '1', title: 'Kernel 產品核心理念筆記', type: 'note', status: 'inbox', createdAt: '2023-01-01' },
        { id: '2', title: 'Building a Second Brain - Tiago Forte', type: 'link', status: 'inbox', createdAt: '2023-01-02' },
        { id: '3', title: 'Another Inbox Item', type: 'note', status: 'inbox', createdAt: '2023-01-03' },
        { id: '4', title: 'Yet Another Item', type: 'note', status: 'inbox', createdAt: '2023-01-04' },
    ];

    let currentResources = [...initialResources];
    const subject = new BehaviorSubject(currentResources);

    const mockResourceService = {
        getAll$: () => subject, // Always return the same subject to simulate realtime updates
        update: vi.fn((id, update) => {
            // Remove from inbox if archived
            if (update.status === 'archived') {
                currentResources = currentResources.filter(r => r.id !== id);
                subject.next([...currentResources]);
            }
            return Promise.resolve();
        }),
        delete: vi.fn((id) => {
            currentResources = currentResources.filter(r => r.id !== id);
            subject.next([...currentResources]);
            return Promise.resolve();
        })
    };

    return {
        services: {
            resource: Promise.resolve(mockResourceService)
        }
    };
});

// Mock Shadcn/Radix components
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

vi.mock("@/components/resources/ResourceItem", () => ({
    ResourceItem: ({ resource, onArchive, onDelete }: any) => (
        <div data-testid="resource-item">
            <span>{resource.title}</span>
            <button title="歸檔" onClick={() => onArchive(resource.id)}>归档</button>
            <button title="刪除" onClick={() => onDelete(resource.id)}>删除</button>
        </div>
    ),
    ResourceStatus: {},
}))

// Mock toaster
vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() }
}))


describe("InboxPage", () => {
    const renderPage = () => render(
        <BrowserRouter>
            <InboxPage />
        </BrowserRouter>
    )

    it("renders the inbox title and correct resource count", async () => {
        renderPage()
        await waitFor(() => expect(screen.queryByText("Loading Inbox...")).not.toBeInTheDocument());
        expect(screen.getByText(/收件匣 Inbox/i)).toBeInTheDocument()
        expect(screen.getByText(/4/i)).toBeInTheDocument()
    })

    it("renders resource items with correct titles", async () => {
        renderPage()
        await waitFor(() => expect(screen.queryByText("Loading Inbox...")).not.toBeInTheDocument());
        expect(screen.getByText("Kernel 產品核心理念筆記")).toBeInTheDocument()
        expect(screen.getByText("Building a Second Brain - Tiago Forte")).toBeInTheDocument()
    })

    it("removes an item when archived", async () => {
        renderPage()
        await waitFor(() => expect(screen.queryByText("Loading Inbox...")).not.toBeInTheDocument());
        const initialCount = screen.getAllByTestId("resource-item").length

        const archiveButtons = screen.getAllByTitle("歸檔")
        fireEvent.click(archiveButtons[0])

        await waitFor(() => {
            expect(screen.getAllByTestId("resource-item").length).toBe(initialCount - 1)
        })
    })

    it("shows empty state when all items are deleted", async () => {
        renderPage()
        await waitFor(() => expect(screen.queryByText("Loading Inbox...")).not.toBeInTheDocument());

        const deleteButtons = screen.getAllByTitle("刪除")
        // Careful: triggering multiple updates might race condition the subject.next if not synchronous
        // But our mock is sync update logic.
        for (const btn of deleteButtons) {
            fireEvent.click(btn);
        }

        await waitFor(() => {
            expect(screen.getByText(/Inbox 已清空/i)).toBeInTheDocument()
        })
    })
})
