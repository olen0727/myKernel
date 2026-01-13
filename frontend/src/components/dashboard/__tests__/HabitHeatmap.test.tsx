import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { HabitHeatmap } from "../HabitHeatmap"

describe("HabitHeatmap", () => {
    it("renders the heatmap container", () => {
        render(<HabitHeatmap />)
        expect(screen.getByTestId("habit-heatmap")).toBeInTheDocument()
    })

    it("renders habits with streak info", () => {
        render(<HabitHeatmap />)
        const streaks = screen.getAllByText(/🔥/)
        expect(streaks.length).toBeGreaterThan(0)
    })
})
