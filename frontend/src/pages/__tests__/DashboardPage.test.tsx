import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import DashboardPage from "../DashboardPage"
import { Subject, BehaviorSubject } from 'rxjs'

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const mockService = {
        getAll$: () => new BehaviorSubject([])
    };
    return {
        services: {
            project: Promise.resolve(mockService),
            habit: Promise.resolve(mockService),
            task: Promise.resolve(mockService),
            resource: Promise.resolve(mockService),
        }
    };
})

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
    it("renders the dashboard title", async () => {
        render(<DashboardPage />)
        await waitFor(() => {
            expect(screen.queryByText("Loading dashboard...")).not.toBeInTheDocument()
        });
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    })

    it("renders four stat cards", async () => {
        render(<DashboardPage />)
        await waitFor(() => {
            expect(screen.queryByText("Loading dashboard...")).not.toBeInTheDocument()
        })
        const cards = screen.getAllByTestId("stat-card")
        expect(cards.length).toBe(4)
    })

    it("renders habit heatmap and metric charts", async () => {
        render(<DashboardPage />)
        await waitFor(() => {
            expect(screen.queryByText("Loading dashboard...")).not.toBeInTheDocument()
        })
        expect(screen.getByTestId("habit-heatmap")).toBeInTheDocument()
        expect(screen.getByTestId("metric-charts")).toBeInTheDocument()
    })
})
