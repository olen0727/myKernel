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

- [ ] 實作 MetricCharts Container
    - [ ] 建立 `src/components/dashboard/MetricCharts.tsx`。
    - [ ] 實作時間範圍狀態 (`timeRange`: 7d, 30d, 90d, 1y)。
- [ ] 實作圖表組件 (使用 Recharts)
    - [ ] 建立 `LineChartComponent` (for Number)。
    - [ ] 建立 `AreaChartComponent` (for Rating)。
    - [ ] 建立 `ScatterChartComponent` (for Time)。
    - [ ] 準備各類型的 Mock Data。
- [ ] 整合至 Dashboard
    - [ ] 將 Charts 區塊加入 Dashboard 頁面。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `recharts`。
- **Component**: Shadcn/UI (Tabs or ToggleGroup for range selector)。

### File Structure Requirements
- `src/components/dashboard/MetricCharts.tsx`: 圖表容器。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.3)
