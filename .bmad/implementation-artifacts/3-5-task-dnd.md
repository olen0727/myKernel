# Story 3.5: Task Drag & Drop Sorting 任務拖曳排序

Status: ready-for-dev

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

- [ ] 安裝 dnd-kit
    - [ ] 執行 `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`。
- [ ] 整合 dnd-kit 至 Workbench
    - [ ] 將 Doing/Todo 列表包裝在 `SortableContext` 中。
    - [ ] 實作 `onDragEnd` 邏輯處理跨欄移動。
- [ ] 整合 dnd-kit 至 TaskList
    - [ ] 實作單一列表內的排序邏輯。

## Dev Notes

### Architecture & Tech Stack
- **Library**: `@dnd-kit/core`, `@dnd-kit/sortable`。
- **Component**: `SortableTaskItem` wrapper。

### File Structure Requirements
- `src/components/tasks/SortableTaskItem.tsx`: 可拖曳任務項。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.5)
