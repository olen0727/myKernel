import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { CreateProjectModal } from "../CreateProjectModal"

describe("CreateProjectModal", () => {
    const mockOnSubmit = vi.fn()
    const mockOnOpenChange = vi.fn()

    const defaultProps = {
        open: true,
        onOpenChange: mockOnOpenChange,
        onSubmit: mockOnSubmit,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders modal with form fields when open", () => {
        render(<CreateProjectModal {...defaultProps} />)

        expect(screen.getByText("建立新專案")).toBeInTheDocument()
        expect(screen.getByLabelText("專案名稱")).toBeInTheDocument()
        expect(screen.getByLabelText("所屬區域 (Area)")).toBeInTheDocument()
        expect(screen.getByLabelText("截止日期 (Due Date)")).toBeInTheDocument()
    })

    it("does not render when closed", () => {
        render(<CreateProjectModal {...defaultProps} open={false} />)

        expect(screen.queryByText("建立新專案")).not.toBeInTheDocument()
    })

    it("shows validation error when name is too short", async () => {
        render(<CreateProjectModal {...defaultProps} />)

        const nameInput = screen.getByLabelText("專案名稱")
        fireEvent.change(nameInput, { target: { value: "A" } })

        const submitButton = screen.getByText("建立專案")
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText("專案名稱至少需要 2 個字元。")).toBeInTheDocument()
        })
        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it("calls onSubmit with form values when valid", async () => {
        render(<CreateProjectModal {...defaultProps} />)

        const nameInput = screen.getByLabelText("專案名稱")
        fireEvent.change(nameInput, { target: { value: "Test Project" } })

        const areaInput = screen.getByLabelText("所屬區域 (Area)")
        fireEvent.change(areaInput, { target: { value: "Work" } })

        const submitButton = screen.getByText("建立專案")
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: "Test Project",
                area: "Work",
                dueDate: "",
            })
        })
        expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it("closes modal when cancel button is clicked", () => {
        render(<CreateProjectModal {...defaultProps} />)

        const cancelButton = screen.getByText("取消")
        fireEvent.click(cancelButton)

        expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it("resets form after successful submission", async () => {
        render(<CreateProjectModal {...defaultProps} />)

        const nameInput = screen.getByLabelText("專案名稱")
        fireEvent.change(nameInput, { target: { value: "Test Project" } })

        const submitButton = screen.getByText("建立專案")
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled()
        })
    })
})
