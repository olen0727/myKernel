
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { format, addDays } from "date-fns"
import JournalPage from "../JournalPage"
import { services } from "@/services"

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

// Mock DateNavigator
vi.mock("@/components/journal/DateNavigator", () => ({
    DateNavigator: ({ currentDate, onDateChange }: { currentDate: Date; onDateChange: (date: Date) => void }) => (
        <div data-testid="date-navigator">
            <span data-testid="current-date">{format(currentDate, "yyyy-MM-dd")}</span>
            <button onClick={() => onDateChange(new Date("2023-01-02"))}>Change Date</button>
        </div>
    )
}))

// Mock Services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');

    const mockLogs = [
        { id: '1', date: '2023-01-01', action: 'daily_note', details: 'My Secret Note', timestamp: 1672531200000 }
    ];

    // We need a stable mock that can be updated in tests or we use `mockImplementation` in tests?
    // Since `services` is imported as singleton, mocking it here sets it for all.
    // We can expose the behavior subject or helper to push values.

    const logSubject = new BehaviorSubject(mockLogs);
    const mockLogService = {
        getAll$: () => logSubject,
        create: vi.fn(),
        update: vi.fn(),
    };

    return {
        services: {
            log: Promise.resolve(mockLogService),
            habit: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
            resource: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
            metric: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
        },
    };
})

// Mock TipTapEditor
vi.mock("@/components/editor/TipTapEditor", () => ({
    TipTapEditor: ({ content, onChange }: { content: string; onChange: (content: string) => void }) => (
        <textarea
            data-testid="tiptap-editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}))

describe("JournalPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("redirects to today's date if no date is provided", async () => {
        const today = format(new Date(), "yyyy-MM-dd")
        render(
            <MemoryRouter initialEntries={["/journal"]}>
                <Routes>
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/journal/${today}`, { replace: true }));
    })

    it("renders the journal layout and DateNavigator", async () => {
        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => expect(screen.queryByText("Loading Journal...")).not.toBeInTheDocument());

        // Check if DateNavigator is rendered with correct date
        expect(screen.getByTestId("date-navigator")).toBeInTheDocument()
        expect(screen.getByTestId("current-date")).toHaveTextContent("2023-01-01")
    })

    it("navigates when date changes in DateNavigator", async () => {
        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )
        await waitFor(() => expect(screen.queryByText("Loading Journal...")).not.toBeInTheDocument());

        fireEvent.click(screen.getByText("Change Date"))
        expect(mockNavigate).toHaveBeenCalledWith("/journal/2023-01-02")
    })

    it("disables habits and metrics for future dates", async () => {
        const futureDate = addDays(new Date(), 1)
        const dateStr = format(futureDate, "yyyy-MM-dd")

        render(
            <MemoryRouter initialEntries={[`/journal/${dateStr}`]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )
        await waitFor(() => expect(screen.queryByText("Loading Journal...")).not.toBeInTheDocument());

        // Find the section container that should be disabled
        // We look for the h2 "Habits" and check its parent container for aria-disabled
        const habitsTitle = screen.getByText("Habits")
        const habitsContainer = habitsTitle.closest("div")
        expect(habitsContainer).toHaveAttribute("aria-disabled", "true")
        expect(habitsContainer).toHaveClass("opacity-50", "pointer-events-none")
    })

    it("loads daily note content from store", async () => {
        // Mock data is already set up in vi.mock
        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )
        await waitFor(() => expect(screen.queryByText("Loading Journal...")).not.toBeInTheDocument());

        await waitFor(() => expect(screen.getByTestId("tiptap-editor")).toHaveValue("My Secret Note"));
    })

    it("auto-saves daily note content after debounce", async () => {
        const logService = await services.log;

        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )
        await waitFor(() => expect(screen.queryByText("Loading Journal...")).not.toBeInTheDocument());

        const editor = screen.getByTestId("tiptap-editor")
        expect(editor).toHaveValue("My Secret Note");

        fireEvent.change(editor, { target: { value: "Updated Note" } })

        // Should not save immediately
        expect(logService.update).not.toHaveBeenCalled()

        // Advance timer using real wait
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1100))
        })

        expect(logService.update).toHaveBeenCalledWith('1', expect.objectContaining({ details: "Updated Note" }))
    })
})
