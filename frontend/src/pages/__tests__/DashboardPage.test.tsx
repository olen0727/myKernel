import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import DashboardPage from "../DashboardPage"

// Mock child components to avoid Tooltip/Recharts issues in DashboardPage test
vi.mock("@/components/dashboard/StatCard", () => ({
    StatCard: ({ title }: any) => <div data-testid="stat-card">{title}</div>
}))

vi.mock("@/components/dashboard/HabitHeatmap", () => ({
    HabitHeatmap: () => <div data-testid="habit-heatmap">Habit Heatmap</div>
}))

vi.mock("@/components/dashboard/MetricCharts", () => ({
    MetricCharts: () => <div data-testid="metric-charts">Metric Charts</div>
}))

describe("DashboardPage", () => {
    it("renders the dashboard title", () => {
        render(<DashboardPage />)
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    })

    it("renders four stat cards", () => {
        render(<DashboardPage />)
        const cards = screen.getAllByTestId("stat-card")
        expect(cards.length).toBe(4)
    })

    it("renders habit heatmap and metric charts", () => {
        render(<DashboardPage />)
        expect(screen.getByTestId("habit-heatmap")).toBeInTheDocument()
        expect(screen.getByTestId("metric-charts")).toBeInTheDocument()
    })
})
