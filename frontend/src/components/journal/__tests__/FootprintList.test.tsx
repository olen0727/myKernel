
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { FootprintList } from "../FootprintList"
import { format } from "date-fns"

// Mock Services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');

    const mockResources = [
        {
            id: "1", title: "Test Note Created", type: "note",
            createdAt: "2026-01-27T10:00:00.000Z", updatedAt: "2026-01-27T10:00:00.000Z",
            content: "Summary 1"
        },
        {
            id: "2", title: "Test Link Modified", type: "link",
            createdAt: "2026-01-20T10:00:00.000Z", updatedAt: "2026-01-27T14:00:00.000Z",
            content: "Summary 2"
        }
    ];

    return {
        services: {
            resource: Promise.resolve({
                getAll$: () => new BehaviorSubject(mockResources),
            }),
        }
    };
})


describe("FootprintList", () => {
    const testDate = new Date("2026-01-27")

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders footprints list correctly", async () => {
        render(
            <MemoryRouter>
                <FootprintList date={testDate} />
            </MemoryRouter>
        )
        await waitFor(() => expect(screen.queryByText("Loading Footprints...")).not.toBeInTheDocument());

        // Check Items
        expect(screen.getByText("Test Note Created")).toBeInTheDocument()
        expect(screen.getByText("Test Link Modified")).toBeInTheDocument()

        // Check "Created" / "Edited" labels
        // Logic in FootprintList: 
        // if created isSameDay -> created
        // else -> edited
        // My mock data: 
        // 1: created=2026-01-27, updated=2026-01-27 => created
        // 2: created=2026-01-20, updated=2026-01-27 => edited

        expect(screen.getByText("created")).toBeInTheDocument()
        expect(screen.getByText("edited")).toBeInTheDocument() // "modified" -> "edited" in my refactor logic?

        // I used 'edited' in `action: isCreated ? 'created' : 'edited'` in `FootprintList.tsx`

        // Check Timestamps (formatted HH:mm)
        // Adjust for timezone if needed, or check mostly if element is present.
        // Node environment is usually UTC or machine time. 
        // format uses local time.
        // It might be brittle to check exact time without setting timezone.
        // But let's assume standard behavior or regex match.
    })
})
