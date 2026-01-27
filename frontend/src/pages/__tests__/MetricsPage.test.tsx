
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
// import MetricsPage from "../MetricsPage" // Does not exist yet
import { dataStore } from "@/services/mock-data-service"

// We need to lazy import or rely on test failing due to missing import first?
// Standard flow: Write test that assumes component exists.

// Mock dataStore
vi.mock("@/services/mock-data-service", () => ({
    dataStore: {
        getMetricDefinitions: vi.fn(),
        addMetricDefinition: vi.fn(),
        updateMetricDefinition: vi.fn(),
        deleteMetricDefinition: vi.fn(),
    }
}))

// NOTE: Since MetricsPage doesn't exist, this file will fail type check. 
// I'll create the file but with the import commented out or just use any to bypass for now?
// No, Red phase means it fails. Import error is a valid failure.

// However, to make it runnable (compile), I need to create at least a dummy file or expect build failure.
// I'll assume I can write the test and running it will fail.

import MetricsPage from "../MetricsPage"

describe("MetricsPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders active and archived sections (or tabs)", () => {
        vi.mocked(dataStore.getMetricDefinitions).mockReturnValue([
            { id: '1', name: 'Active Metric', type: 'number', status: 'active', isSystem: false },
            { id: '2', name: 'Archived Metric', type: 'number', status: 'archived', isSystem: false }
        ])

        render(<MetricsPage />)

        expect(screen.getByText("Active Metric")).toBeInTheDocument()
        // Depending on implementation, archived might be in another tab.
        // If we test specific UI structure (Tabs), we should click tab.
    })

    it("opens create modal when clicking New Metric button", async () => {
        vi.mocked(dataStore.getMetricDefinitions).mockReturnValue([])
        render(<MetricsPage />)

        const newButton = screen.getByText("New Metric")
        fireEvent.click(newButton)

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument()
            // Expect Modal Title
            expect(screen.getByText("Create Metric")).toBeInTheDocument()
        })
    })
})
