import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { HabitHeatmap } from "../HabitHeatmap"

// 由於 Tooltip 可能在測試環境中引起問題，我們可以選擇 Mock 或確保環境支援
// 這裡我們針對新的 UI 內容進行測試

describe("HabitHeatmap", () => {
    it("renders the heatmap container", () => {
        render(<HabitHeatmap />)
        expect(screen.getByTestId("habit-heatmap")).toBeInTheDocument()
    })

    it("renders habits with streaks and max streaks", () => {
        render(<HabitHeatmap />)
        // 檢查是否包含 🔥 符號 (代表連續天數)
        expect(screen.getAllByText(/🔥/).length).toBeGreaterThan(0)
        // 檢查是否包含 Max 字樣 (代表最長連續天數)
        expect(screen.getAllByText(/Max/).length).toBeGreaterThan(0)
    })

    it("renders week labels (w1-w52 style)", () => {
        render(<HabitHeatmap />)
        // 檢查 X 軸是否包含 w 開頭的週號
        expect(screen.getAllByText(/w\d+/).length).toBeGreaterThan(0)
    })
})
