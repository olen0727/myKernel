import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { StatCard } from "@/components/dashboard/StatCard"
import { Box } from "lucide-react"

describe("StatCard", () => {
    it("renders title and value", () => {
        render(<StatCard title="Test Title" value="123" icon={Box} />)
        expect(screen.getByText("Test Title")).toBeInTheDocument()
        expect(screen.getByText("123")).toBeInTheDocument()
    })

    it("renders description if provided", () => {
        render(<StatCard title="Test Title" value="123" icon={Box} description="Test Description" />)
        expect(screen.getByText("Test Description")).toBeInTheDocument()
    })
})
