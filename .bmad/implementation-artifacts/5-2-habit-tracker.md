# Story 5.2: Daily Habit Tracker 日記習慣追蹤

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在日記頁面快速勾選當天已完成的習慣**,
So that **我可以記錄每日進度並累積 Streak**.

## Acceptance Criteria

1. **習慣列表渲染 (Habit Rendering)**
   - **When** 日記頁面載入，**Then** 右側顯示當天有效的習慣 (根據 Habit Manager 設定的頻率與星期)。
   - **Then** 已完成項目顯示打勾狀態，未完成項目顯示空框。

2. **打勾互動 (Check Interaction)**
   - **Given** 當天習慣列表，**When** 點擊 Checkbox，**Then** 狀態切換，並即時更新 Streak 數值 (Mock)。
   - **Then** 觸發微動畫 (Confetti or scale effect) 增加成就感。

3. **歷史資料 (History Data)**
   - **Given** 導航至過去日期，**Then** 顯示該日期的完成狀態。

## Tasks / Subtasks

- [ ] 實作 DailyHabitList Component
    - [ ] 建立 `src/components/journal/DailyHabitList.tsx`。
    - [ ] 實作讀取當日習慣邏輯。
    - [ ] 實作 Checkbox 變更事件。
- [ ] 整合 Habit Item
    - [ ] 顯示習慣名稱、圖示、以及目前的 Streak。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Checkbox)。
- **Lib**: `framer-motion` (for micro-animations, optional)。

### File Structure Requirements
- `src/components/journal/DailyHabitList.tsx`: 每日習慣追蹤器。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.2)
