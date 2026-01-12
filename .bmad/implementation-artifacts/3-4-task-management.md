# Story 3.4: Task Lists & Progress Task Lists & Progress Calculation 任務清單與進度計算

Status: ready-for-dev

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
   - **Given** 使用者勾選任務，**Then** 任務標式為完成 (刪除線)，且頁頭進度條應即時更新。
   - **Given** 使用者點擊「+ Add Task」，**Then** 新增輸入框，按 Enter 儲存並自動新增下一列。

3. **清單管理 (List Management)**
   - **Given** TaskList 選單，**Then** 應提供 Rename 與 Delete List 選項。

## Tasks / Subtasks

- [ ] 實作 TaskList Component
    - [ ] 建立 `src/components/tasks/TaskList.tsx`。
    - [ ] 實作清單標題編輯。
    - [ ] 實作任務渲染 (map items)。
- [ ] 實作 TaskItem Component
    - [ ] 支援 inline edit 任務名稱。
    - [ ] 支援 checkbox 狀態切換。
- [ ] 實作進度計算邏輯
    - [ ] 在 `ProjectDetailPage` 計算總完成度：`completedTasks / totalTasks * 100`。
    - [ ] 傳遞給 `ProjectHeader` 顯示。

## Dev Notes

### Architecture & Tech Stack
- **State**: Checkbox change should trigger re-calculation.
- **Component**: Shadcn/UI (Checkbox, DropdownMenu for list options)。

### File Structure Requirements
- `src/components/tasks/TaskList.tsx`: 任務清單容器。
- `src/components/tasks/TaskItem.tsx`: 單一任務項目。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.4)
