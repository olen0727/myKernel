# Story 3.2: Project Cards & Filters 專案卡片與篩選

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **以卡片形式檢視所有專案，並可依狀態篩選**,
So that **我可以快速掌握專案全貌並找到目標專案**.

## Acceptance Criteria

1. **專案卡片顯示 (Card Display)**
   - **Given** 使用者在 Projects 頁面，**When** 列表渲染，**Then** 應以網格 (Grid) 顯示專案卡片。
   - **Then** 每張卡片應顯示：狀態標籤 (Active/Completed)、專案名稱、進度條 (`x/y` 任務完成)。

2. **篩選功能 (Filtering)**
   - **Given** 頁面頂部，**When** 使用者點擊狀態篩選按鈕 (Active/Completed/Archived)，**Then** 列表應即時過濾。

3. **新增專案 (Create Project)**
   - **Given** 使用者點擊 `[+ New Project]` 按鈕，**Then** 應彈出 Modal。
   - **When** 填寫專案名稱並提交，**Then** 應建立新專案 (Mock) 並導航至詳情頁。
   - **Fields**: Project Name (必填), Area (選填), Due Date (選填)。

## Tasks / Subtasks

- [ ] 實作 ProjectCard Component
    - [ ] 建立 `src/components/projects/ProjectCard.tsx`。
    - [ ] 實作進度條 (`Progress` component)。
- [ ] 實作 CreateProjectModal
    - [ ] 建立 `src/components/projects/CreateProjectModal.tsx`。
    - [ ] 使用 Form (react-hook-form + zod) 處理輸入。
- [ ] 整合至 ProjectListPage
    - [ ] 實作篩選狀態 (`filterStatus`)。
    - [ ] 實作卡片網格渲染。

## Dev Notes

### Architecture & Tech Stack
- **Form**: `react-hook-form` + `zod`。
- **Component**: Shadcn/UI (Dialog, Form, Select, Badge, Progress)。

### File Structure Requirements
- `src/components/projects/ProjectCard.tsx`: 專案卡片。
- `src/components/projects/CreateProjectModal.tsx`: 新增專案視窗。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.2)
