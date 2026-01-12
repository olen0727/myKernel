# Story 5.7: Sleep Tracking Module 睡眠追蹤模組

Status: ready-for-dev

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

- [ ] 實作 SleepTracker Component
    - [ ] 建立 `src/components/journal/SleepTracker.tsx`。
    - [ ] 使用 `date-fns` 計算時間差。
- [ ] 整合至 Metric Input 流程
    - [ ] 視為特殊類型的 Metric 處理。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `date-fns` (`differenceInMinutes`)。

### File Structure Requirements
- `src/components/journal/SleepTracker.tsx`: 睡眠追蹤器。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.5)
