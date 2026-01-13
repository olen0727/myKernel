import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { TaskItem } from "../TaskItem"

describe("TaskItem", () => {
    it("renders task title and project name", () => {
        render(<TaskItem id="1" title="Test Task" projectName="Test Project" />)
        expect(screen.getByText("Test Task")).toBeInTheDocument()
        expect(screen.getByText("Test Project")).toBeInTheDocument()
    })

    it("calls onToggle when clicked", () => {
        const onToggle = vi.fn()
        render(<TaskItem id="1" title="Test Task" onToggle={onToggle} />)
        // Checkbox from shadcn/ui is usually found by role checkbox or its id
        const checkbox = screen.getByRole("checkbox")
        fireEvent.click(checkbox)
        expect(onToggle).toHaveBeenCalledWith("1")
    })

    it("shows strikethrough when completed", () => {
        render(<TaskItem id="1" title="Test Task" completed={true} />)
        const label = screen.getByText("Test Task")
        expect(label).toHaveClass("line-through")
    })
})
