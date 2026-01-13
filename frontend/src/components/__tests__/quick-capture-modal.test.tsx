import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { QuickCaptureModal } from "../quick-capture-modal"
import { useQuickCapture } from "@/stores/quick-capture-store"

// Mock sonner
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
    },
}))

describe("QuickCaptureModal", () => {
    it("renders when isOpen is true", () => {
        useQuickCapture.setState({ isOpen: true })
        render(<QuickCaptureModal />)
        expect(screen.getByText(/快速捕捉/i)).toBeInTheDocument()
    })

    it("closes when ESC is pressed on the textarea", () => {
        useQuickCapture.setState({ isOpen: true })
        render(<QuickCaptureModal />)

        const textarea = screen.getByPlaceholderText(/在此輸入想法/i)
        fireEvent.keyDown(textarea, { key: "Escape" })
        expect(useQuickCapture.getState().isOpen).toBe(false)
    })

    it("submits content via button click", async () => {
        useQuickCapture.setState({ isOpen: true })
        render(<QuickCaptureModal />)

        const textarea = screen.getByPlaceholderText(/在此輸入想法/i)
        fireEvent.change(textarea, { target: { value: "Test capture content" } })

        const saveButton = screen.getByRole("button", { name: "儲存" })
        fireEvent.click(saveButton)

        await waitFor(() => {
            expect(useQuickCapture.getState().isOpen).toBe(false)
        }, { timeout: 2000 })
    })

    it("submits content via Ctrl+Enter", async () => {
        useQuickCapture.setState({ isOpen: true })
        render(<QuickCaptureModal />)

        const textarea = screen.getByPlaceholderText(/在此輸入想法/i)
        fireEvent.change(textarea, { target: { value: "Shortcut test" } })

        fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true })

        await waitFor(() => {
            expect(useQuickCapture.getState().isOpen).toBe(false)
        }, { timeout: 2000 })
    })
})
