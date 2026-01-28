# Story 5.7: Sleep Tracking Module 睡眠追蹤模組

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在日記中記錄睡眠時間，並自動計算睡眠時數**,
So that **我可以追蹤睡眠品質與規律性**.

## Acceptance Criteria

1. **睡眠輸入元件 (Input Component)**
   - **Given** 睡眠追蹤啟用，**Then** 日記頁顯示 Sleep Tracker。
   - **Fields**: 入睡時間 (Sleep At, 昨晚), 起床時間 (Wake Up At, 今日)。

2. **自動計算 (Auto Calc)**
   - **When** 兩者填寫完成，**Then** 顯示睡眠總時數 (e.g., "7 hrs 30 mins")。
   - **Logic**: 支援跨日計算 (e.g., 23:00 to 07:00)。

## Tasks / Subtasks

- [x] 實作 SleepTracker Component
    - [x] 建立 `src/components/journal/SleepTracker.tsx`。
    - [x] 使用 `date-fns` 計算時間差。
- [x] 整合至 Metric Input 流程
    - [x] 視為特殊類型的 Metric 處理。

### Review Follow-ups (AI)
- [x] [AI-Review][High] Add unit tests for sleep duration calculation logic (SleepTracker.test.tsx)
- [x] [AI-Review][Medium] Fix accessibility issue: Label htmlFor pointing to non-input element (SleepTracker.tsx)
- [x] [AI-Review][Medium] Refactor: Extract calculation logic to pure function for better testability (SleepTracker.tsx)

## File List

- src/components/journal/SleepTracker.tsx
- src/components/journal/__tests__/SleepTracker.test.tsx
- src/components/journal/MetricInputList.tsx
- src/components/journal/MetricItem.tsx
- src/services/mock-data-service.ts

## Change Log

- 2026-01-28: Implemented SleepTracker component with date-fns logic. Integrated into MetricInputList to handle separate sleep/wake times via metadata. Updated MetricItem to support accessibility. Added unit tests for SleepTracker.
- 2026-01-29: [AI-Review] Refactored SleepTracker to extract calculation logic. Fixed accessibility issues. Added comprehensive unit tests in SleepTracker.test.tsx.

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `date-fns` (`differenceInMinutes`)。

### File Structure Requirements
- `src/components/journal/SleepTracker.tsx`: 睡眠追蹤器。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.5)
