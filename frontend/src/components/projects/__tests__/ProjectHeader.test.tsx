import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ProjectHeader } from "../ProjectHeader"

describe("ProjectHeader", () => {
    const mockProps = {
        title: "Test Project",
        description: "Test Description",
        doneTasks: 5,
        totalTasks: 10,
        onTitleChange: vi.fn(),
        onDescriptionChange: vi.fn(),
    }

    it("renders project titles and description correctly", () => {
        render(<ProjectHeader {...mockProps} />)

        expect(screen.getByText("Test Project")).toBeDefined()
        expect(screen.getByText("Test Description")).toBeDefined()
        expect(screen.getByText("5 / 10 任務已完成")).toBeDefined()
    })

    it("switches to editing mode for title on click", () => {
        render(<ProjectHeader {...mockProps} />)

        const titleElement = screen.getByText("Test Project")
        fireEvent.click(titleElement)

        const input = screen.getByDisplayValue("Test Project")
        expect(input).toBeDefined()
    })

    it("calls onTitleChange update when title input is blurred", () => {
        render(<ProjectHeader {...mockProps} />)

        fireEvent.click(screen.getByText("Test Project"))
        const input = screen.getByDisplayValue("Test Project")

        fireEvent.change(input, { target: { value: "New Title" } })
        fireEvent.blur(input)

        expect(mockProps.onTitleChange).toHaveBeenCalledWith("New Title")
    })
})
