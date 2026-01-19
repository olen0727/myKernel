# Story 4.4: Resource Library & Filters 資源庫與篩選

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在資源庫中搜尋與篩選已處理的資源**,
So that **我可以快速找到需要的參考資料**.

## Acceptance Criteria

1. **資源列表顯示 (Library Display)**
   - **Given** 訪問 `/resources`，**Then** 顯示 Filter Bar 與資源列表。
   - **List Item**: 顯示 icon, title, excerpt, context badges (Project/Area/Tags)。

2. **篩選器 (Filters)**
   - **Given** Filter Bar，**Then** 包含：
     - Status (Processed/Archived/All, default: Processed)。
     - Project / Area 篩選 (Select)。
     - Tag 篩選 (Multi-select)。
   - **Logic**: 改變篩選條件時列表即時更新。

3. **樣式細節 (Style)**
   - **Given** Archived 資源，**Then** 顯示淡化樣式與標籤。

## Tasks / Subtasks

- [x] 實作 ResourceLibraryPage
    - [x] 建立 `src/pages/ResourceLibraryPage.tsx`。
- [x] 實作 FilterBar Component
    - [x] 建立 `src/components/resources/FilterBar.tsx`。
    - [x] 實作 Select 與 Combobox (for tags)。
- [x] 復用 ResourceItem Component
    - [x] 確保 `ResourceItem` 支援不同 Context 下的顯示 (Inbox vs Library)。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Select, Popover, Command for Combobox)。

### File Structure Requirements
- `src/pages/ResourceLibraryPage.tsx`: 資源庫主頁。
- `src/components/resources/FilterBar.tsx`: 篩選列。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-4.4)

## Dev Agent Record

### Completion Notes
- Implemented `ResourceLibraryPage` with mock data.
- Implemented `FilterBar` with Search, Status Select, Project Select, and Tags Combobox (using Popover+Command).
- Reused `ResourceItem` which supports archive/delete actions.
- Added unit tests in `ResourceLibraryPage.test.tsx` verifying title, filter bar presence, and items.

## File List
- frontend/src/pages/ResourceLibraryPage.tsx
- frontend/src/components/resources/FilterBar.tsx
- frontend/src/pages/__tests__/ResourceLibraryPage.test.tsx

## Change Log
- 2026-01-20: Initial implementation of Resource Library story.
