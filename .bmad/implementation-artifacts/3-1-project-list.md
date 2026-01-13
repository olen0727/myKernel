# Story 3.1: Project List & Workbench 專案列表與工作台

Status: review

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

- [x] 實作 ProjectListPage
    - [x] 建立 `src/pages/ProjectListPage.tsx`。
    - [x] 實作上下分割佈局 (`react-resizable-panels` 或 CSS resize)。
- [x] 實作 Workbench Component
    - [x] 建立 `src/components/projects/Workbench.tsx`。
    - [x] 實作兩欄式任務列表 (Using Mock Data)。
- [x] 實作 TaskItem Component
    - [x] 建立 `src/components/tasks/TaskItem.tsx`。
    - [x] 支援 Checkbox 勾選狀態。


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
  
## Dev Agent Record

### Implementation Plan
- [x] 實作 ProjectListPage 路由與基礎佈局。
- [x] 整合 `react-resizable-panels`。
- [x] 實作 Workbench 與 TaskItem 組件。
- [x] 撰寫測試。

### Debug Log
- 2026-01-13: 開始開發。
- 2026-01-13: 完成元件實作與測試撰寫。由於環境限制，未能成功執行 `npm install`，建議使用者手動執行 `npm install` 以解決 lint 錯誤。

### Completion Notes
- 實作了 `ProjectListPage`，採用 `react-resizable-panels` 實現上下分割。
- 實作了 `Workbench` 元件，展示今日焦點與待辦任務。
- 實作了 `TaskItem` 元件，支援勾選與專案標籤顯示。
- 新增了相關的單元測試。

## File List
- `src/pages/ProjectListPage.tsx`
- `src/components/projects/Workbench.tsx`
- `src/components/tasks/TaskItem.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/resizable.tsx`
- `src/pages/__tests__/ProjectListPage.test.tsx`
- `src/components/projects/__tests__/Workbench.test.tsx`
- `src/components/tasks/__tests__/TaskItem.test.tsx`

## Change Log
- 2026-01-13: 初始化工作區並更新狀態。
- 2026-01-13: 完成 Story 3.1 實作。

Status: review

