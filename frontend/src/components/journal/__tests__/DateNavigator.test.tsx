
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { DateNavigator } from "../DateNavigator"
import { addDays, subDays } from "date-fns"

// Mock Shadcn UI components
vi.mock("@/components/ui/calendar", () => ({
    Calendar: ({ selected, onSelect }: any) => (
        <div data-testid="calendar" onClick={() => onSelect(new Date())}>
            Calendar
        </div>
    ),
}))
vi.mock("@/components/ui/popover", () => ({
    Popover: ({ children }: any) => <div>{children}</div>,
    PopoverTrigger: ({ children }: any) => <div data-testid="popover-trigger">{children}</div>,
    PopoverContent: ({ children }: any) => <div data-testid="popover-content">{children}</div>,
}))
vi.mock("@/components/ui/button", () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
}))

describe("DateNavigator", () => {
    const today = new Date()
    const onDateChange = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders components", () => {
        render(<DateNavigator currentDate={today} onDateChange={onDateChange} />)
        expect(screen.getByTestId("popover-trigger")).toBeInTheDocument()
    })

    it("navigates to previous day on button click", () => {
        render(<DateNavigator currentDate={today} onDateChange={onDateChange} />)
        const prevBtn = screen.getByLabelText("Previous day")
        fireEvent.click(prevBtn)
        const expected = subDays(today, 1)
        expect(onDateChange).toHaveBeenCalled()
        const callArg = onDateChange.mock.calls[0][0]
        expect(callArg.toDateString()).toBe(expected.toDateString())
    })

    it("navigates to next day on button click", () => {
        render(<DateNavigator currentDate={today} onDateChange={onDateChange} />)
        const nextBtn = screen.getByLabelText("Next day")
        fireEvent.click(nextBtn)
        const expected = addDays(today, 1)
        expect(onDateChange).toHaveBeenCalled()
        const callArg = onDateChange.mock.calls[0][0]
        expect(callArg.toDateString()).toBe(expected.toDateString())
    })

    it("navigates to previous day on hotkey Ctrl+[", () => {
        render(<DateNavigator currentDate={today} onDateChange={onDateChange} />)
        fireEvent.keyDown(document, { key: "[", ctrlKey: true })
        const expected = subDays(today, 1)
        expect(onDateChange).toHaveBeenCalled()
        const callArg = onDateChange.mock.calls[0][0]
        expect(callArg.toDateString()).toBe(expected.toDateString())
    })

    it("navigates to next day on hotkey Ctrl+]", () => {
        render(<DateNavigator currentDate={today} onDateChange={onDateChange} />)
        fireEvent.keyDown(document, { key: "]", ctrlKey: true })
        const expected = addDays(today, 1)
        expect(onDateChange).toHaveBeenCalled()
        const callArg = onDateChange.mock.calls[0][0]
        expect(callArg.toDateString()).toBe(expected.toDateString())
    })
})
