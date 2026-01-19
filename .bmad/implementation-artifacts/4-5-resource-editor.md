# Story 4.5: Resource Editor Page 資源編輯頁

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在資源編輯頁檢視與編輯資源的完整內容**,
So that **我可以深度整理與分類這筆資訊**.

## Acceptance Criteria

1. **頁面佈局 (Layout)**
   - **Given** 編輯頁 (`/resources/:id`)，**Then** 顯示左側主內容 (Title, TipTap Editor, OG Preview) 與右側屬性欄。

2. **屬性側欄 (Sidebar)**
   - **Then** 包含：已分流目標 (Linked Projects/Areas)、分流工具按鈕 (`+ Link`)、Tags input、Source Link、Status Badge、Archive/Delete 操作。

3. **自動儲存 (Auto-save)**
   - **When** 編輯內容，**Then** 應 Mock 自動儲存 UI (Saving... / Saved)。

## Tasks / Subtasks

- [x] 實作 ResourceEditorPage
    - [x] 建立 `src/pages/ResourceEditorPage.tsx`。
- [x] 整合 TipTap Editor (Placeholder)
    - [x] 建立 `src/components/editor/TipTapEditor.tsx` (暫時使用 Textarea 或簡易實作)。
- [x] 實作 ResourceSidebar
    - [x] 建立 `src/components/resources/ResourceSidebar.tsx`。
- [x] 實作 OG Preview Card (Mock)

## Dev Notes

### Architecture & Tech Stack
- **Editor**: TipTap (or plain Textarea for MVP).
- **Component**: Shadcn/UI (Input, badges).

### File Structure Requirements
- `src/pages/ResourceEditorPage.tsx`: 資源編輯頁。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-4.5)

## Dev Agent Record

### Completion Notes
- Implemented `TipTapEditor.tsx` with basic extension configuration.
- Implemented `ResourceSidebar.tsx` with properties management (Status, Tags, PARA links).
- Implemented `ResourceEditorPage.tsx` integrating editor and sidebar, with mock data support.
- Added comprehensive unit tests in `ResourceEditorPage.test.tsx`.
- Implemented Mock OG Preview Card within the Editor Page.

## File List
- frontend/src/components/editor/TipTapEditor.tsx
- frontend/src/components/resources/ResourceSidebar.tsx
- frontend/src/pages/ResourceEditorPage.tsx
- frontend/src/pages/__tests__/ResourceEditorPage.test.tsx

## Change Log
- 2026-01-20: Completed Resource Editor implementation including TipTap integration and Sidebar.
