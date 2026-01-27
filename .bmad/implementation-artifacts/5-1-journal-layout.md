# Story 5.1: Journal Layout & Navigation 日記頁面佈局與導航

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在日記頁面快速切換日期，檢視不同日期的紀錄**,
So that **我可以回顧過去的狀態或補填遺漏的資料**.

## Acceptance Criteria

1. **頁面結構 (Page Structure)**
   - **Given** 訪問 Journal 頁面 (`/journal`)，**Then** 預設顯示今日日期，URL 更新為 `/journal/YYYY-MM-DD`。
   - **Layout**: 左側 60% (筆記區 + 足跡區)，右側 40% (習慣 + 指標 + Action Guide)。

2. **日期導航 (Date Navigation)**
   - **Given** 頂部導航器，**Then** 顯示當前日期 (可點擊開啟日曆 Picker)。
   - **Then** 提供 `<` (前一天)、`Today`、`>` (後一天) 按鈕。
   - **Then** 支援鍵盤快捷鍵 (`Cmd/Ctrl + [` 前一天，`Cmd/Ctrl + ]` 後一天)。

3. **未來日期限制 (Future Date)**
   - **Given** 選擇未來日期，**Then** 習慣勾選與指標填寫區域應禁用 (Disabled)，僅供檢視專案與任務資訊 (唯讀)。

## Tasks / Subtasks

- [x] 實作 JournalPage
    - [x] 建立 `src/pages/JournalPage.tsx`。
    - [x] 實作 URL date param 讀取與驗證 (useParams)。
- [x] 實作 DateNavigator Component
    - [x] 建立 `src/components/journal/DateNavigator.tsx`。
    - [x] 實作快捷鍵監聽。
    - [x] 整合 Shadcn/UI `Calendar` + `Popover`。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `date-fns`。
- **Component**: Shadcn/UI (Button, Calendar, Popover)。

### File Structure Requirements
- `src/pages/JournalPage.tsx`: 日記主頁。
- `src/components/journal/DateNavigator.tsx`: 日期導航。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.1)

## File List
- frontend/src/pages/JournalPage.tsx
- frontend/src/components/journal/DateNavigator.tsx
- frontend/src/pages/__tests__/JournalPage.test.tsx
- frontend/src/components/journal/__tests__/DateNavigator.test.tsx

## Change Log
- 2026-01-27: Initial implementation of Journal Page and Date Navigator.

## Dev Agent Record

### Completion Notes
- Implemented `JournalPage` with 60/40 grid layout and URL date parameter handling.
- Implemented `DateNavigator` with previous/next buttons, calendar picker, and keyboard shortcuts (Ctrl+[/]).
- Added disabled state for Habits and Metrics sections when viewing future dates.
- Verified with unit tests for both component and page integration.

### Review Follow-ups (AI)
- [x] [AI-Review][High] Fix Global Hotkey Conflict in `DateNavigator.tsx`: Ensure hotkeys ensure input focus check.
- [x] [AI-Review][Medium] Improve Disabled State in `JournalPage.tsx`: Use accessible `inert` or `disabled` props instead of just CSS pointer-events.
- [x] [AI-Review][Low] Fix Invalid Date URL in `JournalPage.tsx`: Ensure URL updates if `date` param is invalid.

