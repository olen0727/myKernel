# Story 3.3: Project Detail Page 專案詳情頁

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在專案詳情頁看到完整的專案資訊與任務管理區域**,
So that **我可以深入管理單一專案的執行狀況**.

## Acceptance Criteria

1. **頁面佈局 (Page Layout)**
   - **Given** 使用者訪問專案詳情頁 (`/projects/:id`)，**When** 頁面載入，**Then** 應顯示兩欄式佈局 (左 70% 內容，右 30% 資訊)。
   - **Main Content**: 專案名稱 (Inline Edit)、進度條、摘要區 (Markdown)、任務清單區。
   - **Sidebar**: 狀態 (Badge)、截止日期、所屬領域、Archive/Delete 按鈕。

2. **編輯功能 (Editing)**
   - **Given** 專案名稱或摘要，**When** 使用者點擊，**Then** 應可直接編輯 (Inline Edit) 並在失焦時儲存。

3. **刪除確認 (Delete Confirmation)**
   - **Given** 使用者點擊 Delete 按鈕，**Then** 應彈出警告對話框，確認後導航回列表頁。

## Tasks / Subtasks

- [x] 實作 ProjectDetailPage
    - [x] 建立 `src/pages/ProjectDetailPage.tsx`。
    - [x] 實作 Layout 架構。
- [x] 實作 ProjectHeader Component
    - [x] 包含標題輸入框 (Auto-resize input) 與進度顯示。
- [x] 實作 ProjectSidebar Component
    - [x] 包含屬性設定區塊 (Status, Date picker, Area select)。
    - [x] 使用 Shadcn/UI `Popover` + `Calendar` 實作日期選擇。

## Dev Agent Record

### Implementation Plan
- [x] 建立 `ProjectHeader` 與 `ProjectSidebar` 元件。
- [x] 整合至 `ProjectDetailPage` 佈局。
- [x] 實作 Inline Edit 功能。
- [x] 撰寫測試。

### Debug Log
- 2026-01-13: 開始開發。
- 2026-01-13: 完成元件實作與測試。成功整合 Shadcn Calendar 與 Popover。

### Completion Notes
- 建立了功能完備的 `ProjectDetailPage`。
- `ProjectHeader`: 實現了點擊標題或描述直接編輯的功能。
- `ProjectSidebar`: 提供了豐富的專案元數據設定。
- 使用 `Tabs` 佈局預留了 Story 3.4 任務管理的整合空間。

## File List
- `src/pages/ProjectDetailPage.tsx`
- `src/components/projects/ProjectHeader.tsx`
- `src/components/projects/ProjectSidebar.tsx`
- `src/components/projects/__tests__/ProjectHeader.test.tsx`
- `src/components/ui/popover.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/alert-dialog.tsx`

## Change Log
- 2026-01-13: 初始化工作區並更新狀態。
- 2026-01-13: 完成 Story 3.3 並提交審查。

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.3)
