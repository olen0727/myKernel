# Story 3.3: Project Detail Page 專案詳情頁

Status: ready-for-dev

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

- [ ] 實作 ProjectDetailPage
    - [ ] 建立 `src/pages/ProjectDetailPage.tsx`。
    - [ ] 實作 Layout 架構。
- [ ] 實作 ProjectHeader Component
    - [ ] 包含標題輸入框 (Auto-resize input) 與進度顯示。
- [ ] 實作 ProjectSidebar Component
    - [ ] 包含屬性設定區塊 (Status, Date picker, Area select)。
    - [ ] 使用 Shadcn/UI `Popover` + `Calendar` 實作日期選擇。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Input, Textarea, Button, Badge, AlertDialog)。
- **Lib**: `react-day-picker` (via Shadcn Calendar)。

### File Structure Requirements
- `src/pages/ProjectDetailPage.tsx`: 專案詳情頁。
- `src/components/projects/ProjectHeader.tsx`: 頁頭。
- `src/components/projects/ProjectSidebar.tsx`: 側欄屬性。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-3.3)
