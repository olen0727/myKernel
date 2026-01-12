# Story 5.3: Daily Metric Input 指標輸入

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在日記頁面記錄當天的量化指標 (如睡眠時間、心情、專注度)**,
So that **我可以量化生活狀態，並透過圖表分析長期趨勢**.

## Acceptance Criteria

1. **指標輸入表單 (Metric Form)**
   - **Given** 日記頁面載入，**Then** 顯示 Metrics 區塊。
   - **Then** 根據 Metric 類型顯示對應輸入控制元件：
     - Number (e.g., Weight): Input type="number"。
     - Rating (e.g., Mood, Focus): 1-5 Star or Slider。
     - Time (e.g., Sleep): Time Picker or Number (hours)。

2. **驗證與儲存 (Validation & Save)**
   - **Given** 使用者輸入數值，**When** 失焦 (Blur) 或按 Enter，**Then** 自動儲存。
   - **Validation**: 數值超出範圍應顯示錯誤 (e.g., Rating 1-5)。

## Tasks / Subtasks

- [ ] 實作 MetricInputList Component
    - [ ] 建立 `src/components/journal/MetricInputList.tsx`。
    - [ ] 實作 MetricItem Component (根據 type 渲染 Input/Slider)。
    - [ ] 準備 Mock Metrics 定義 (Mood, Energy, Sleep)。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Slider, Input)。
- **Lib**: `react-hook-form` (optional, for validation)。

### File Structure Requirements
- `src/components/journal/MetricInputList.tsx`: 指標輸入列表。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.3)
