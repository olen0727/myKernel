
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { FootprintList } from "../FootprintList"
import { dataStore } from "@/services/mock-data-service"
import { format } from "date-fns"

// Mock the dataStore
vi.mock("@/services/mock-data-service", () => ({
    dataStore: {
        getResourceFootprints: vi.fn(),
    }
}))

describe("FootprintList", () => {
    const testDate = new Date("2026-01-27")

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders empty state when no footprints exist", () => {
        vi.mocked(dataStore.getResourceFootprints).mockReturnValue([])

        render(
            <MemoryRouter>
                <FootprintList date={testDate} />
            </MemoryRouter>
        )

        expect(screen.getByText("無資源足跡")).toBeInTheDocument()
    })

    it("renders footprints list correctly", () => {
        const mockFootprints = [
            {
                id: "1",
                title: "Test Note Created",
                type: "note",
                action: "created",
                timestamp: new Date("2026-01-27T10:00:00"),
                summary: "Summary 1"
            },
            {
                id: "2",
                title: "Test Link Modified",
                type: "link",
                action: "modified",
                timestamp: new Date("2026-01-27T14:00:00"),
                summary: "Summary 2"
            }
        ]

        vi.mocked(dataStore.getResourceFootprints).mockReturnValue(mockFootprints as any)

        render(
            <MemoryRouter>
                <FootprintList date={testDate} />
            </MemoryRouter>
        )

        // Check Items
        expect(screen.getByText("Test Note Created")).toBeInTheDocument()
        expect(screen.getByText("Test Link Modified")).toBeInTheDocument()

        // Check "Created" / "Modified" labels
        expect(screen.getByText("created")).toBeInTheDocument()
        expect(screen.getByText("modified")).toBeInTheDocument()

        // Check Timestamps (formatted HH:mm)
        expect(screen.getByText("10:00")).toBeInTheDocument()
        expect(screen.getByText("14:00")).toBeInTheDocument()
    })

    it("queries footprints for the correct date", () => {
        vi.mocked(dataStore.getResourceFootprints).mockReturnValue([])

        render(
            <MemoryRouter>
                <FootprintList date={testDate} />
            </MemoryRouter>
        )

        expect(dataStore.getResourceFootprints).toHaveBeenCalledWith(format(testDate, "yyyy-MM-dd"))
    })
})
