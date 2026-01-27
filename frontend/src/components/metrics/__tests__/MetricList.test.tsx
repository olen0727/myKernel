
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MetricList } from "../MetricList"
import { dataStore } from "@/services/mock-data-service"

vi.mock("@/services/mock-data-service", () => ({
    dataStore: {
        updateMetricDefinition: vi.fn(),
        deleteMetricDefinition: vi.fn(),
    }
}))

describe("MetricList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("displays delete button only for non-system metrics", () => {
        const metrics = [
            { id: '1', name: 'System Metric', type: 'number', status: 'active', isSystem: true },
            { id: '2', name: 'Custom Metric', type: 'number', status: 'active', isSystem: false }
        ] as any

        render(<MetricList metrics={metrics} onUpdate={vi.fn()} onEdit={vi.fn()} />)

        const deleteButtons = screen.queryAllByTitle("Delete")
        expect(deleteButtons).toHaveLength(1)
    })


    it("calls delete for custom metric", () => {
        const metrics = [
            { id: '2', name: 'Custom Metric', type: 'number', status: 'active', isSystem: false }
        ] as any

        // Mock confirmation to be true? No, we switched to AlertDialog, so window.confirm is not used.
        // We need to simulate clicking delete, then clicking confirm in the dialog.

        render(<MetricList metrics={metrics} onUpdate={vi.fn()} onEdit={vi.fn()} />)

        fireEvent.click(screen.getByTitle("Delete"))

        // Dialog should be open. Text "Are you absolutely sure?"
        expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()

        // Click the continue/delete button in dialog
        fireEvent.click(screen.getByText("Delete")) // The Action button text

        expect(dataStore.deleteMetricDefinition).toHaveBeenCalledWith('2')
    })

    it("calls archive when archive button is clicked", () => {
        const metrics = [
            { id: '1', name: 'Test Metric', type: 'number', status: 'active', isSystem: false }
        ] as any

        render(<MetricList metrics={metrics} onUpdate={vi.fn()} onEdit={vi.fn()} />)

        fireEvent.click(screen.getByTitle("Archive"))
        expect(dataStore.updateMetricDefinition).toHaveBeenCalledWith('1', { status: 'archived' })
    })

    it("calls onEdit when edit button is clicked", () => {
        const metrics = [
            { id: '3', name: 'Edit Me', type: 'number', status: 'active', isSystem: false }
        ] as any
        const onEdit = vi.fn()

        render(<MetricList metrics={metrics} onUpdate={vi.fn()} onEdit={onEdit} />)

        fireEvent.click(screen.getByTitle("Edit"))
        expect(onEdit).toHaveBeenCalledWith(metrics[0])
    })
})
