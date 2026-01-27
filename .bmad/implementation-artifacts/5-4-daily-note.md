# Story 5.4: Daily Note Editor 每日筆記編輯器

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在日記頁面撰寫詳細的每日筆記，包含文字、圖片、甚至連結資源**,
So that **我可以進行自由書寫 (Free-writing) 與反思**.

## Acceptance Criteria

1. **編輯器整合 (Editor Integration)**
   - **Given** 日記頁面，**Then** 左側大區域顯示 Note Editor。
   - **Then** 支援 Rich Text (Bold, Italic, List, Checkbox)。
   - **Then** 支援 Slash Command (Mock: `/todo`, `/heading`)。

2. **自動儲存 (Auto-save)**
   - **When** 內容變更，**Then** 自動儲存內容至該日期的 Journal Entry。

3. **資源透過雙括號連結 (Wiki-link) **
   - **Given** 使用者輸入 `[[`，**Then** 觸發資源搜尋選單，**When** 選擇資源，**Then** 插入連結。 (此功能可能是進階需求，MVP 可先實作純文字)。

## Tasks / Subtasks

- [x] 復用 TipTap Editor
    - [x] 在 `JournalPage` 引用 `src/components/editor/TipTapEditor.tsx`。
- [x] 實作資料載入與儲存
    - [x] 根據 URL 日期載入 Content。
    - [x] 實作 Debounced Auto-save。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `tiptap`。
- **Hook**: `useDebounce`。

### File Structure Requirements
- `src/components/editor/TipTapEditor.tsx`: 通用編輯器。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.4)

## Dev Agent Record

### Implementation Plan
- [x] Integrated `TipTapEditor` into `JournalPage`.
- [x] Implemented `useDebounce` hook for efficient auto-saving.
- [x] Updated `MockDataService` to support `JournalEntry` storage.
- [x] Added comprehensive unit tests for `JournalPage` editor integration and auto-save logic.

### File List
- `frontend/src/pages/JournalPage.tsx`: Integrated editor and auto-save logic.
- `frontend/src/hooks/use-debounce.ts`: New hook for debouncing.
- `frontend/src/services/mock-data-service.ts`: Added JournalEntry support.
- `frontend/src/pages/__tests__/JournalPage.test.tsx`: Updated tests.

### Completion Notes
- Daily Note functionality is complete.
- Editor supports rich text and slash commands.
- Auto-save works with 1s debounce.
- Validated with tests: `JournalPage.test.tsx` passed.
- Note: Some unrelated tests in the repo are failing (CreateProjectModal), but JournalPage tests are green.

## Senior Developer Review (AI)

- **Date**: 2026-01-28
- **Reviewer**: Olen (AI Agent)
- **Outcome**: Approved with Fixes
- **Issues Found & Fixed**: 2 (Medium)
    1.  **Version Control**: Tracked `frontend/src/hooks/use-debounce.ts`.
    2.  **Code Quality**: Removed `any` types in `JournalPage.test.tsx` mocks to comply with architecture standards.
- **Status**: Ready to merge.
