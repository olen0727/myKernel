
import { render, screen, fireEvent, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { format, addDays } from "date-fns"
import JournalPage from "../JournalPage"

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

// Mock DataStore
vi.mock("@/services/mock-data-service", () => ({
    dataStore: {
        getJournalEntry: vi.fn(),
        saveJournalEntry: vi.fn(),
        getAllHabits: vi.fn().mockReturnValue([]),
        getMetricDefinitions: vi.fn().mockReturnValue([]),
        getMetricEntries: vi.fn().mockReturnValue([]),
        toggleHabitCompletion: vi.fn(),
        getResourceFootprints: vi.fn().mockReturnValue([]),
    }
}))

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

import { dataStore } from "@/services/mock-data-service"

describe("JournalPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("redirects to today's date if no date is provided", () => {
        const today = format(new Date(), "yyyy-MM-dd")
        render(
            <MemoryRouter initialEntries={["/journal"]}>
                <Routes>
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        expect(mockNavigate).toHaveBeenCalledWith(`/journal/${today}`, { replace: true })
    })

    it("renders the journal layout and DateNavigator", () => {
        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        // Check if DateNavigator is rendered with correct date
        expect(screen.getByTestId("date-navigator")).toBeInTheDocument()
        expect(screen.getByTestId("current-date")).toHaveTextContent("2023-01-01")
    })

    it("navigates when date changes in DateNavigator", () => {
        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        fireEvent.click(screen.getByText("Change Date"))
        expect(mockNavigate).toHaveBeenCalledWith("/journal/2023-01-02")
    })

    it("disables habits and metrics for future dates", () => {
        const futureDate = addDays(new Date(), 1)
        const dateStr = format(futureDate, "yyyy-MM-dd")

        render(
            <MemoryRouter initialEntries={[`/journal/${dateStr}`]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        // Find the section container that should be disabled
        // We look for the h2 "Habits" and check its parent container for aria-disabled
        const habitsTitle = screen.getByText("Habits")
        const habitsContainer = habitsTitle.closest("div")
        expect(habitsContainer).toHaveAttribute("aria-disabled", "true")
        expect(habitsContainer).toHaveClass("opacity-50", "pointer-events-none")
    })

    it("loads daily note content from store", () => {
        vi.mocked(dataStore.getJournalEntry).mockReturnValue({ content: "My Secret Note", id: '1', date: '2023-01-01', createdAt: new Date(), updatedAt: new Date() })

        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        expect(dataStore.getJournalEntry).toHaveBeenCalledWith("2023-01-01")
        expect(screen.getByTestId("tiptap-editor")).toHaveValue("My Secret Note")
    })

    it("auto-saves daily note content after debounce", async () => {
        vi.mocked(dataStore.getJournalEntry).mockReturnValue({ content: "", id: '1', date: '2023-01-01', createdAt: new Date(), updatedAt: new Date() })

        render(
            <MemoryRouter initialEntries={["/journal/2023-01-01"]}>
                <Routes>
                    <Route path="/journal/:date" element={<JournalPage />} />
                </Routes>
            </MemoryRouter>
        )

        const editor = screen.getByTestId("tiptap-editor")

            // Initial save might happen due to state sync
            ; vi.mocked(dataStore.saveJournalEntry).mockClear()

        fireEvent.change(editor, { target: { value: "Updated Note" } })

        // Should not save immediately
        expect(dataStore.saveJournalEntry).not.toHaveBeenCalled()

        // Advance timer using real wait
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1100))
        })

        expect(dataStore.saveJournalEntry).toHaveBeenCalledWith("2023-01-01", "Updated Note")
    })
})
