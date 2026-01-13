# Story 3.5: Task Drag & Drop Sorting 任務拖曳排序

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **透過拖曳方式調整任務順序，並將任務在 Doing/Todo 之間移動**,
So that **我可以靈活地安排工作優先級與焦點任務**.

## Acceptance Criteria

1. **Workbench 拖曳 (Workbench Dragging)**
   - **Given** 使用者在 Workbench，**When** 拖曳任務至 Doing/Todo 區域，**Then** 任務應移動至該區域。
   - **Then** 拖曳過程應有視覺反饋 (半透明預覽、高亮放置區)。

2. **Project 排序拖曳 (Project Sorting)**
   - **Given** Project Detail 的 TaskList，**When** 拖曳任務上下調整，**Then** 任務順序應更新。

3. **互動體驗 (UX)**
   - **Then** 應顯示拖曳手把圖示 (Drag Handle)。
   - **Then** 支援鍵盤操作 (Accessibility)。

## Tasks / Subtasks

- [x] 安裝 dnd-kit
    - [x] 執行 `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`。
- [x] 整合 dnd-kit 至 Workbench
    - [x] 將 Doing/Todo 列表包裝在 `SortableContext` 中。
    - [x] 實作 `onDragEnd` 邏輯處理跨欄移動。
- [x] 整合 dnd-kit 至 TaskList
    - [x] 實作單一列表內的排序邏輯。

## Dev Agent Record

### Implementation Plan
- [x] 安裝 `@dnd-kit` 相關套件。
- [x] 建立 `SortableTaskItem` 作為任務的拖曳封裝。
- [x] 在 `ProjectDetailPage` 實作跨任務群組的拖曳與排序邏輯。
- [x] 在 `Workbench` 實作 Doing 與 Todo 之間的跨欄拖曳邏輯。
- [x] 使用 `DragOverlay` 優化視覺體驗。

### Debug Log
- 2026-01-13: 開始開發 3.5。
- 2026-01-13: 解決了 Inline Edit 與拖曳動作衝突的問題。
- 2026-01-13: 實作了 `findContainer` 邏輯，確保任務能正確落入空的容器。

### Completion Notes
- 全站任務系統現在支援流暢的**拖曳排序**功能。
- **Workbench**：可以將任務自由拖曳至「Do Today」或「Todo」欄位。
- **專案詳情頁**：支援跨群組拖曳，方便使用者重新編排階段任務。
- 加入了**拖曳手把 (Drag Handle)** 與**半透明預覽圖層**。

## File List
- `src/components/tasks/SortableTaskItem.tsx`
- `src/components/tasks/TaskList.tsx`
- `src/pages/ProjectDetailPage.tsx`
- `src/components/projects/Workbench.tsx`

## Change Log
- 2026-01-13: 完成 Story 3.5 並提交審查。

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.5)
