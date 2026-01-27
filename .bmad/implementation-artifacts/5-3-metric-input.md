# Story 5.3: Daily Metric Input 指標輸入

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在日記頁面記錄當天的量化指標 (如睡眠時間、專注度)**,
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

- [x] 實作 MetricInputList Component
    - [x] 建立 `src/components/journal/MetricInputList.tsx`。
    - [x] 實作 MetricItem Component (根據 type 渲染 Input/Slider)。
    - [x] 準備 Mock Metrics 定義 (Mood, Energy, Sleep)。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Slider, Input)。
- **Lib**: `react-hook-form` (optional, for validation)。

### File Structure Requirements
- `src/components/journal/MetricInputList.tsx`: 指標輸入列表。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.3)

## Dev Agent Record

### Implementation Plan
- [x] 擴充 `mock-data-service.ts` 支援 `MetricDefinition` 與 `MetricEntry` 以及儲存邏輯。
- [x] 建立 `MetricItem.tsx` 支援 Rating (Buttton) 與 Number (Input) 類型。
- [x] 建立 `MetricInputList.tsx` 並整合測試。
- [x] 在 `JournalPage.tsx` 中整合 `MetricInputList`。

### File List
- frontend/src/components/journal/MetricItem.tsx
- frontend/src/components/journal/MetricInputList.tsx
- frontend/src/components/journal/__tests__/MetricInputList.test.tsx
- frontend/src/pages/JournalPage.tsx
- frontend/src/services/mock-data-service.ts

### Completion Notes
- 已完成指標輸入功能。
- 支援 Mood, Energy (Rating 1-5) 與 Sleep (Number 0-24)。
- Mock data persistence works per day.

### Review Follow-ups (AI)
- [x] [AI-Review][High] Fix Silent Validation Failure: Added red border and text state for validation errors.
- [x] [AI-Review][Medium] Fix UI Deviation: Replaced number buttons with Star icons for ratings.
- [x] [AI-Review][Low] Add Clear Option: Clicking the same rating again clears the value.
