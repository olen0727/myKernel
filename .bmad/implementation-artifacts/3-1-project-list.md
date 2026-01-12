# Story 3.1: Project List & Workbench 專案列表與工作台

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在專案列表頁看到 Workbench 工作台，聚合顯示跨專案的待辦任務**,
So that **我可以專注於「今天該做什麼」，而不需要逐一檢視各專案**.

## Acceptance Criteria

1. **Workbench 顯示 (Workbench Display)**
   - **Given** 使用者訪問 Projects 頁面 (`/projects`)，**When** 頁面載入，**Then** 頁面應分為上下兩部分：Workbench (上) 與 Project List (下)。
   - **Then** Workbench 應顯示「Do Today」與「Todo」兩欄。
   - **Then** 左側 **Doing**: 顯示焦點任務 (Mock: 2 筆)。
   - **Then** 右側 **Todo**: 顯示所有 Active 專案的未完成任務 (Mock: 8 筆)。

2. **任務項目 (Task Items)**
   - **Then** 每筆任務應顯示：勾選框、任務名稱、所屬專案名稱 (Tag)。

3. **區域調整 (Resizable Splitter)**
   - **Given** Workbench 與 Project List 之間，**Then** 應提供可拖曳的分隔線 (Resizer)，允許調整兩區域高度比例。

## Tasks / Subtasks

- [ ] 實作 ProjectListPage
    - [ ] 建立 `src/pages/ProjectListPage.tsx`。
    - [ ] 實作上下分割佈局 (`react-resizable-panels` 或 CSS resize)。
- [ ] 實作 Workbench Component
    - [ ] 建立 `src/components/projects/Workbench.tsx`。
    - [ ] 實作兩欄式任務列表 (Using Mock Data)。
- [ ] 實作 TaskItem Component
    - [ ] 建立 `src/components/tasks/TaskItem.tsx`。
    - [ ] 支援 Checkbox 勾選狀態。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `react-resizable-panels` (Shadcn/UI `Resizable`)。
- **Component**: Shadcn/UI (Checkbox, Badge)。

### File Structure Requirements
- `src/pages/ProjectListPage.tsx`: 專案列表頁。
- `src/components/projects/Workbench.tsx`: 工作台元件。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.1)
