# Story 4.1: Area List & Grid 領域列表與網格

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **以視覺化的卡片網格檢視所有領域**,
So that **我可以看到人生版圖的全貌，並快速進入感興趣的領域**.

## Acceptance Criteria

1. **領域網格顯示 (Grid Display)**
   - **Given** 使用者訪問 Areas 頁面 (`/areas`)，**When** 頁面載入，**Then** 應顯示網格視圖 (Grid Layout)。

2. **領域卡片內容 (Card Content)**
   - **Then** 每張卡片應包含：
     - **上半部**: 滿版封面圖 (Cover Image)。
     - **下半部**: 領域名稱、狀態燈號 (Active/Hidden)、關鍵統計 (Active Projects 數 / Habits 數)。

3. **新增入口 (New Area Entry)**
   - **Then** 領域列表末端應顯示 `[+ New Area]` 卡片作為新增入口。

4. **新增模態 (Create Modal)**
   - **Given** 使用者點擊 `[+ New Area]`，**When** 模態開啟，**Then** 應顯示 Name 輸入框 (必填) 與預設封面圖選擇器 (Mock)。

## Tasks / Subtasks

- [x] 實作 AreaListPage
    - [x] 建立 `src/pages/AreaListPage.tsx`。
- [x] 實作 AreaCard Component
    - [x] 建立 `src/components/areas/AreaCard.tsx`。
    - [x] 上半部使用 `img` tag (object-cover)，下半部顯示 info。
- [x] 實作 CreateAreaModal
    - [x] 建立 `src/components/areas/CreateAreaModal.tsx`。

### Review Follow-ups (AI)
- [x] [AI-Review][Medium] 增進 Card 無障礙性 (Accessibility)，支援鍵盤導覽與正確角色標籤 `[src/components/areas/AreaCard.tsx]`
- [x] [AI-Review][Medium] 實作圖片加載失敗的 Fallback UI 或預設占位圖 `[src/components/areas/AreaCard.tsx]`
- [x] [AI-Review][High] 整合 `mock-data-service` 以實現數據持久化，避免頁面重整後新增數據消失 `[src/pages/AreaListPage.tsx]`
- [x] [AI-Review][Low] 統一 ID 生成策略，改用 `crypto.randomUUID()` `[src/pages/AreaListPage.tsx]`

## Dev Agent Record (AI)

### Implementation Plan
1.  **Mock Data**: 更新 `mock-data-service.ts` 以包含領域資料。
2.  **Components**: 建立 `AreaCard` 與 `CreateAreaModal` 組件。
3.  **Page**: 實作 `AreaListPage` 並整合上述組件。
4.  **Tests**: 撰寫單元測試以驗證列表顯示與模態行為。

### Completion Notes
- ✅ 實作 `AreaCard` 組件，支援封面圖、狀態燈號與統計數字。
- ✅ 實作 `CreateAreaModal` 組件，支援名稱輸入與封面預覽選擇。
- ✅ 實作 `AreaListPage` 頁面，採用響應式網格佈局，整合完整增刪改查模擬邏輯。
- ✅ 通過 `AreaCard.test.tsx` 與 `AreaListPage.test.tsx` 單元測試。
- ✅ [AI-Review] 修正了 `AreaCard` 的視覺細節與無障礙標籤。

## File List
- `src/services/mock-data-service.ts` (Modified)
- `src/pages/AreaListPage.tsx` (Modified)
- `src/components/areas/AreaCard.tsx` (New)
- `src/components/areas/CreateAreaModal.tsx` (New)
- `src/components/areas/__tests__/AreaCard.test.tsx` (New)
- `src/pages/__tests__/AreaListPage.test.tsx` (New)

## Change Log
- 2026-01-14: 開始實作 Area List & Grid。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Dialog, AspectRatio for cover image)。

### File Structure Requirements
- `src/pages/AreaListPage.tsx`: 領域列表頁。
- `src/components/areas/AreaCard.tsx`: 領域卡片。

### References
- [Architecture](../architecture.md)
- [Epics](../planning-artifacts/epics.md#Story-4.1)
