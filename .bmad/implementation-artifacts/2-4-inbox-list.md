# Story 2.4: Inbox List Page 收件匣列表頁

Status: ready-for-dev

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

- [ ] 實作 InboxPage
    - [ ] 建立 `src/pages/InboxPage.tsx`。
    - [ ] 實作列表渲染邏輯 (map mock data)。
- [ ] 實作 ResourceItem Component
    - [ ] 建立 `src/components/resources/ResourceItem.tsx`。
    - [ ] 實作 Hover Group 顯示 Action Buttons。
    - [ ] 實作 Context Menu (Shadcn/UI `ContextMenu` 可選)。
- [ ] 實作 EmptyState Component
    - [ ] 建立通用的 `src/components/ui/empty-state.tsx`。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Button, ScrollArea)。
- **Routing**: `useNavigate` (React Router)。

### File Structure Requirements
- `src/pages/InboxPage.tsx`: 收件匣主頁。
- `src/components/resources/ResourceItem.tsx`: 列表單項元件。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.4)
