import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { TaskList } from "../TaskList"

describe("TaskList", () => {
    const mockProps = {
        id: "list-1",
        title: "Test List",
        items: [
            { id: "task-1", title: "Task 1", completed: false },
        ],
        onTaskToggle: vi.fn(),
        onTaskTitleChange: vi.fn(),
        onAddTask: vi.fn(),
        onRenameList: vi.fn(),
        onDeleteList: vi.fn(),
    }

    it("renders list title and tasks", () => {
        render(<TaskList {...mockProps} />)
        expect(screen.getByText("Test List")).toBeDefined()
        expect(screen.getByText("Task 1")).toBeDefined()
    })

    it("calls onAddTask when new task is submitted", () => {
        render(<TaskList {...mockProps} />)

        const addButton = screen.getByText("新增任務")
        fireEvent.click(addButton)

        const input = screen.getByPlaceholderText("任務名稱...")
        fireEvent.change(input, { target: { value: "New Task" } })
        fireEvent.keyDown(input, { key: "Enter" })

        expect(mockProps.onAddTask).toHaveBeenCalledWith("list-1", "New Task")
    })

    it("calls onRenameList when title is edited", () => {
        render(<TaskList {...mockProps} />)

        const title = screen.getByText("Test List")
        fireEvent.click(title)

        const input = screen.getByDisplayValue("Test List")
        fireEvent.change(input, { target: { value: "Renamed List" } })
        fireEvent.blur(input)

        expect(mockProps.onRenameList).toHaveBeenCalledWith("list-1", "Renamed List")
    })
})
