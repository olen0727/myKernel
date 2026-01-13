# Story 2.4: Inbox List Page 收件匣列表頁

## Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在 Inbox 頁面看到所有待處理的資源列表**,
So that **我可以檢視並決定如何處理這些資訊**.

## Acceptance Criteria

1. **列表顯示 (List Display)**
   - **Given** 使用者訪問 Inbox 頁面 (`/inbox`)，**When** 頁面載入，**Then** 應顯示頁面標題 "Inbox" 與資源計數器 (e.g., "Inbox (3)")。
   - **Then** 每筆資源應顯示：類型圖示、標題、摘要 (前 50 字)、時間戳記 (e.g., "2h ago")。
   - **Note**: 使用 Mock Data 填充列表。

2. **互動操作 (Interactions)**
   - **Given** 使用者將滑鼠懸停於列表項目，**Then** 應顯示 Hover Actions：`Link to Project/Area`, `Archive`, `Delete` (按鈕暫時僅需實作 UI，功能可 Mock/Console log)。
   - **Given** 使用者點擊列表項目，**Then** 應導航至 Resource Editor 頁面 (`/resources/:id`)。

3. **空狀態 (Empty State)**
   - **Given** Inbox 沒有任何待處理資源，**Then** 應顯示 Empty State (插圖 + 激勵文字)。

## Tasks / Subtasks

- [x] 實作 InboxPage
    - [x] 建立 `src/pages/InboxPage.tsx`。
    - [x] 實作列表渲染邏輯 (使用 Mock Data)。
- [x] 實作 ResourceItem Component
    - [x] 建立 `src/components/resources/ResourceItem.tsx`。
    - [x] 實作 Hover Group 顯示 Action Buttons (歸檔、刪除、連結)。
    - [x] 實作 Context Menu (Shadcn/UI `ContextMenu`)。
- [x] 實作 EmptyState Component
    - [x] 建立通用的 `src/components/ui/empty-state.tsx`。

## Dev Agent Record

### Implementation Plan
- 建立 `InboxPage` 收件匣主頁面，採用大標題與清爽的列表佈局。
- 實作 `ResourceItem` 元件，支援不同類型的圖示 (Note/Link)、時間戳記與摘要。
- 為 `ResourceItem` 添加 Hover 快速操作欄 (Archived/Delete/Link) 與右鍵選單 (Context Menu)。
- 實作通用 `EmptyState` 元件，用於收件匣清空時的激勵顯示。
- 完善單元測試，涵蓋列表渲染、歸檔操作與空狀態切換。

### Completion Notes
- 完成收件匣列表頁面開發。
- 整合 Shadcn/UI ContextMenu 提升高級感。
- 已同步至 `router.tsx`。
- 單元測試通過。

## File List
- `frontend/src/pages/InboxPage.tsx`
- `frontend/src/components/resources/ResourceItem.tsx`
- `frontend/src/components/ui/empty-state.tsx`
- `frontend/src/pages/__tests__/InboxPage.test.tsx`

## Change Log
- 2026-01-13: 初始化收件匣列表頁面與相關組件 (Story 2.4)

## Status: review

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.4)
