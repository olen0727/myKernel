# Story 2.2: Habit Heatmap & Strength 連續達成天數

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **看到習慣達成的熱力圖與連續天數統計**,
So that **我可以追蹤自己的行為模式並保持動力**.

## Acceptance Criteria

1. **熱力圖顯示 (Activity Heatmap)**
   - **Given** 使用者在 Dashboard 檢視習慣追蹤區塊，**When** 區塊載入，**Then** 應顯示行為熱力圖。
   - **And** 習慣追蹤顯示最近 7 週的數據，每個區塊代表一週。
   - **And** 每格顏色深淺代表該週執行的次數 (例如：達成 7 次最綠，0 次為灰色)。
   - **And** X 軸應顯示當週為該年度第幾週 (格式：w1~w52)，不顯示年份。

2. **連續達成天數 (Current & Max Streak)**
   - **Given** 熱力圖已渲染，**When** 使用者檢視習慣列表，**Then** 每個習慣名稱旁應顯示「目前連續天數」與「最長連續天數」。
   - **And** 格式範例：`🔥 5 / Max 12 days` (Mock Data)。

3. **互動與提示 (Interaction & Tooltip)**
   - **Given** 使用者將滑鼠懸停於熱力圖某一週的區塊，**When** 觸發 Hover 事件，**Then** 應顯示 Tooltip 顯示該週內每天的詳細達成進度。

4. **響應式設計 (Responsive)**
   - **Given** 螢幕寬度改變，**Then** 圖表應自動調整寬度以適應容器。

## Tasks / Subtasks

- [x] 安裝 Recharts
    - [x] 確認 `recharts` 已安裝 (若未安裝需執行 `npm install recharts`)。
- [x] 實作 Heatmap Component
    - [x] 建立 `src/components/dashboard/HabitHeatmap.tsx`。
    - [x] 準備 Mock Data (包含最近 7 週的週數據與 Streak 數據)。
    - [x] 使用 CSS Grid 與色彩深淺實作週度熱力圖效果。
- [x] 整合 Streak 顯示
    - [x] 顯示目前連續天數 (🔥) 與最長連續天數 (Max)。
- [x] 整合至 Dashboard
    - [x] 將更新後的 Heatmap 區塊整合進 Dashboard 頁面。

## Dev Agent Record

### Implementation Plan
- 調整 `HabitHeatmap` 為「週視圖」：顯示最近 7 週數據。
- 每週區塊色彩深度代表該週達成次數 (0-7 次)。
- 擴增 Streak 顯示：目前天數 與 最長天數。
- X 軸顯示年度週號 (w1~w52)。
- 實作原生 `title` 懸停提示 (因測試環境對 Radix Tooltip 有副作用)。

### Debug Log
- 測試環境持續出現 `Invalid hook call` 與 `useRef` 錯誤，確認與 `Radix UI Tooltip` 在 Vitest/jsdom 環境中的渲染衝突有關。
- 解決方案：在 `HabitHeatmap` 中改用 HTML 原生 `title` 屬性提供懸停資訊，確保組件在測試與開發環境皆能穩定運行。
- 修正 `getAllByText` 處理多個 Match 元素的問題。

### Completion Notes
- 完成「週度熱力圖」模式轉換。
- 支援「目前 vs 最長」達成天數顯示。
- 確保年度週號正確顯示在 X 軸。
- 單元測試全面通過。

## File List
- `frontend/src/components/dashboard/HabitHeatmap.tsx`
- `frontend/src/components/dashboard/__tests__/HabitHeatmap.test.tsx`
- `frontend/src/pages/DashboardPage.tsx`

## Change Log
- 2026-01-13: 優化熱力圖為週度模式並加強連續天數顯示 (Story 2.2)

## Status: review

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.2)
