import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import DashboardPage from "@/pages/DashboardPage"

describe("DashboardPage", () => {
    it("renders the dashboard title", () => {
        render(<DashboardPage />)
        expect(screen.getByText("Dashboard")).toBeInTheDocument()
    })

    it("renders four stat cards", () => {
        render(<DashboardPage />)
        // Check for titles of the cards
        expect(screen.getByText(/腦同步天數/)).toBeInTheDocument()
        expect(screen.getByText(/Inbox 未處理數/)).toBeInTheDocument()
        expect(screen.getByText(/進行中專案/)).toBeInTheDocument()
        expect(screen.getByText(/待辦任務/)).toBeInTheDocument()
    })
})
