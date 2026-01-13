# Story 3.4: Task Lists & Progress Task Lists & Progress Calculation 任務清單與進度計算

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在專案中建立多個任務清單，並勾選完成任務**,
So that **我可以有組織地拆解專案工作，並追蹤完成進度**.

## Acceptance Criteria

1. **任務清單顯示 (Task List Display)**
   - **Given** 專案詳情頁，**Then** 應顯示多個 TaskList 群組 (Mock)。
   - **Then** 每個 TaskList 包含：可編輯標題、任務項目列表、「+ Add Task」按鈕。

2. **任務操作 (Task Operations)**
   - **Given** 使用體勾選任務，**Then** 任務標式為完成 (刪除線)，且頁頭進度條應即時更新。
   - **Given** 使用者點擊「+ Add Task」，**Then** 新增輸入框，按 Enter 儲存並自動新增下一列。

3. **清單管理 (List Management)**
   - **Given** TaskList 選單，**Then** 應提供 Rename 與 Delete List 選項。

## Tasks / Subtasks

- [x] 實作 TaskList Component
    - [x] 建立 `src/components/tasks/TaskList.tsx`。
    - [x] 實作清單標題編輯制。
    - [x] 實作任務渲染 (map items)。
- [x] 實作 TaskItem Component (Refactor)
    - [x] 支援 inline edit 任務名稱。
    - [x] 支援 checkbox 狀態切換。
- [x] 實作進度計算邏輯
    - [x] 在 `ProjectDetailPage` 計算總完成度：`completedTasks / totalTasks * 100`。
    - [x] 傳遞給 `ProjectHeader` 顯示。

## Dev Agent Record

### Implementation Plan
- [x] 重寫 `TaskItem` 組件以支援編輯模式與互動。
- [x] 建立 `TaskList` 作為任務群組，整合「新增任務」流。
- [x] 在 `ProjectDetailPage` 實作跨列表的狀態提升與進度條同步。
- [x] 撰寫元件測試。

### Debug Log
- 2026-01-13: 開始開發 3.4。
- 2026-01-13: 成功實作「快速連續新增」UX：Enter 儲存後自動開啟下一個輸入框。

### Completion Notes
- 專案詳情頁現在具備完整的任務管理功能。
- 支援任務群組（清單）的重新命名與刪除。
- 任務進度計算已動態連結至頁頭的 Progress Bar。

## File List
- `src/components/tasks/TaskItem.tsx`
- `src/components/tasks/TaskList.tsx`
- `src/pages/ProjectDetailPage.tsx`
- `src/components/tasks/__tests__/TaskList.test.tsx`

## Change Log
- 2026-01-13: 完成 Story 3.4 並提交專案詳情頁功能。

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.4)
