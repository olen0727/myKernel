# Story 3.2: Project Cards & Filters 專案卡片與篩選

Status: review

## Story

As a **使用者**,
I want **在專案列表頁看到各專案的摘要卡片，並能根據狀態進行篩選**,
So that **我可以快速掌握所有專案的進度，並找到我感興趣的專案群組**.

## Acceptance Criteria

1. **專案卡片 (Project Cards)**
   - **Then** 每個專案應顯示為獨立卡片。
   - **Then** 卡片內容包含：專案名稱、所屬領域、狀態標籤 (Badge)、進度條 (Progress Bar) 以及任務完成比例 (e.g., 5/10)。

2. **狀態篩選 (Status Filters)**
   - **Given** 專案列表上方，**Then** 應顯示篩選按鈕列 (All, Active, Paused, Completed)。
   - **When** 點擊特定狀態，**Then** 列表應即時過濾僅顯示符合該狀態的專案。

3. **新增專案 (Create Project)**
   - **When** 點擊「New Project」，**Then** 彈出對話框 (Dialog)，包含名稱與領域輸入。
   - **Then** 提交後應自動新增至列表並引導至詳情頁。

### Implementation Plan
- [x] 實作 ProjectCard 元件（含進度條與狀態指標）。
- [x] 實作 CreateProjectModal 元件（含表單驗證）。
- [x] 整合篩選功能至 ProjectListPage。
- [x] 撰寫元件測試。

### Debug Log
- 2026-01-13: 開始開發。
- 2026-01-13: 使用 `shadcn` 安裝 `dialog`, `progress`, `form` 元件。
- 2026-01-13: 安裝 `react-hook-form`, `zod` 依賴。
- 2026-01-13: 實作完成，單元測試通過。

### Completion Notes
- 建立了獨立的 `ProjectCard` 元件，優化了視覺顯示。
- 實作了「新增專案」彈窗，支援完整表單驗證。
- 增加了狀態篩選按鈕列 (All, Active, Paused, Completed)。

## File List
- `src/components/projects/ProjectCard.tsx`
- `src/components/projects/CreateProjectModal.tsx`
- `src/pages/ProjectListPage.tsx`
- `src/components/projects/__tests__/ProjectCard.test.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/input.tsx`

## Change Log
- 2026-01-13: 初始化工作區並完成 Story 3.2。

Status: review
