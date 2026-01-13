# Story 2.3: Metrics Trend Charts 指標趨勢圖表

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **看到各項指標的歷史趨勢圖表**,
So that **我可以了解自己的狀態變化並發現模式**.

## Acceptance Criteria

1. **圖表類型支援 (Chart Types)**
   - **Given** 使用者在 Dashboard 檢視指標視覺化區塊，**When** 區塊載入，**Then** 應顯示至少一張趨勢圖表。
   - **Then** 根據指標類型顯示適當圖表：
     - Number 類型：折線圖 (Line Chart)。
     - Rating 類型：區域圖 (Area Chart)。
     - Time 類型：散點圖 (Dot Plot)。

2. **時間範圍選擇 (Time Range Selector)**
   - **Given** 圖表區塊頂部，**When** 使用者檢視選擇器，**Then** 應提供切換按鈕：7D / 30D (預設) / 90D / 1Y。
   - **When** 切換時間範圍，**Then** 圖表應即時更新顯示對應區間的 Mock Data。

3. **Tooltip 資訊**
   - **Given** 使用者將滑鼠懸停於圖表資料點，**Then** 應顯示 Tooltip (包含日期、指標名稱、數值)。

## Tasks / Subtasks

- [x] 實作 MetricCharts Container
    - [x] 建立 `src/components/dashboard/MetricCharts.tsx`。
    - [x] 實作時間範圍狀態 (`timeRange`: 7d, 30d, 90d, 1y)。
- [x] 實作圖表組件 (使用 Recharts)
    - [x] 建立 `LineChartComponent` (用於 Number 類型)。
    - [x] 建立 `AreaChartComponent` (用於 Rating 類型)。
    - [x] 建立 `ScatterChartComponent` (用於 Time 類型)。
    - [x] 準備各類型的 Mock Data。
- [x] 整合至 Dashboard
    - [x] 將 Charts 區塊加入 Dashboard 頁面。

## Dev Agent Record

### Implementation Plan
- 建立 `MetricCharts` 組件，整合 `recharts`。
- 支援 Line, Area, Scatter 三種圖表類型，對應不同指標格式。
- 實作 7D/30D/90D/1Y 時間範圍切換邏輯。
- 使用 Shadcn/UI Tabs 實作選擇器。
- 整合至 Dashboard，採響應式網格佈局。

### Completion Notes
- 完成指標趨勢圖表組件。
- 通過單元測試 (並解決測試環境下的組件 Mock 問題)。
- 已整合至 Dashboard 頁面。

## File List
- `frontend/src/components/dashboard/MetricCharts.tsx`
- `frontend/src/components/dashboard/__tests__/MetricCharts.test.tsx`
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/__tests__/DashboardPage.test.tsx`

## Change Log
- 2026-01-13: 實作指標趨勢圖表與時間範圍選擇功能 (Story 2.3)

## Status: review

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.3)
