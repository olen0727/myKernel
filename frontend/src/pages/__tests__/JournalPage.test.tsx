
import { render, screen, fireEvent } from "@testing-library/react"
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
    DateNavigator: ({ currentDate, onDateChange }: any) => (
        <div data-testid="date-navigator">
            <span data-testid="current-date">{format(currentDate, "yyyy-MM-dd")}</span>
            <button onClick={() => onDateChange(new Date("2023-01-02"))}>Change Date</button>
        </div>
    )
}))

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
})
