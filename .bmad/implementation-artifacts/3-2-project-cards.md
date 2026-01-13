# Story 3.2: Project Cards & Filters 專案卡片與篩選

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
