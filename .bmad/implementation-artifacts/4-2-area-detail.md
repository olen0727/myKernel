# Story 4.2: Area Detail Layout 領域詳情頁

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在領域詳情頁看到完整的領域資訊、關聯專案與習慣管理區**,
So that **我可以全面維護這個人生責任範圍**.

## Acceptance Criteria

1. **詳情頁結構 (Structure)**
   - **Given** 使用者訪問 Area Detail (`/areas/:id`)，**Then** 應顯示 Main Content (左) + Sidebar (右) 結構。
   - **Header**: 顯示滿版背景圖、標題 (Inline Edit)、核心統計 (Active Projects/Habits)。

2. **內容區塊 (Main Content)**
   - **Then** 左側包含：習慣管理區 (Habit Manager - 列表 placeholder)、進行中專案 (Project Cards loop)。

3. **側欄區塊 (Sidebar)**
   - **Then** 右側包含：描述 (Editable Textarea)、關聯資源 (Links)、Hidden Toggle、Delete 按鈕。

4. **互動 (Interactions)**
   - **Given** 點擊 Header 封面圖，**Then** 彈出圖片更換 Mock UI。
   - **Given** 點擊 Delete，**Then** 需二次確認。

## Tasks / Subtasks

- [x] 實作 AreaDetailPage
    - [x] 建立 `src/pages/AreaDetailPage.tsx`。
- [x] 實作 AreaHeader Component
    - [x] 建立 `src/components/areas/AreaHeader.tsx`。
    - [x] 支援背景圖顯示與標題編輯。
- [x] 實作 AreaSidebar Component
    - [x] 建立 `src/components/areas/AreaSidebar.tsx`。
    - [x] 實作屬性編輯與刪除邏輯。

### Review Follow-ups (AI)
- [x] [AI-Review][High] 實作更換封面圖的 Mock UI，而非僅顯示 Toast `[src/components/areas/AreaHeader.tsx]`
- [x] [AI-Review][Medium] 移除相關專案的硬編碼，根據 `areaId` 過濾真實數據 `[src/pages/AreaDetailPage.tsx]`
- [x] [AI-Review][Low] 行內編輯支援 `Esc` 鍵取消修改 `[src/components/areas/AreaHeader.tsx]`

## Dev Agent Record (AI)

### Implementation Plan
1.  **Mock Data**: 更新 `mock-data-service.ts` 擴充 `Area` 介面，增加 `description` 與 `coverImage` 欄位。
2.  **Components**: 建立 `AreaHeader` 與 `AreaSidebar` 組件。
3.  **Page**: 實作 `AreaDetailPage` 整合左右佈局。
4.  **Tests**: 撰寫單元測試驗證詳情頁渲染與基本互動。

### Completion Notes
- ✅ 實作 `AreaHeader` 組件，支援封面圖背景、標題點擊編輯 (Inline Edit) 與狀態標籤。
- ✅ 實作 `AreaSidebar` 組件，包含描述編輯區 (`Textarea`)、隱藏開關 (`Switch`) 與刪除二次確認 (`AlertDialog`)。
- ✅ 實作 `AreaDetailPage` 頁面，採用 Left (Content) + Right (Sidebar) 結構，並加入 Tabs 分隔專案與習慣區。
- ✅ 通過 `AreaDetailPage.test.tsx` 整合測試，驗證頁面結構與數據渲染。

## File List
- `src/services/mock-data-service.ts` (Modified)
- `src/pages/AreaDetailPage.tsx` (Modified)
- `src/components/areas/AreaHeader.tsx` (New)
- `src/components/areas/AreaSidebar.tsx` (New)
- `src/pages/__tests__/AreaDetailPage.test.tsx` (New)

## Change Log
- 2026-01-14: 開始實作 Area Detail Layout。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Switch for hidden toggle, Textarea)。

### File Structure Requirements
- `src/pages/AreaDetailPage.tsx`: 領域詳情頁。
- `src/components/areas/AreaHeader.tsx`: 頁頭。

### References
- [Architecture](../architecture.md)
- [Epics](../planning-artifacts/epics.md#Story-4.2)
