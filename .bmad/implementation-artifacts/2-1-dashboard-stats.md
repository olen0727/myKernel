# Story 2.1: Dashboard 統計卡片與系統概覽

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在儀表板上看到系統運行狀況的關鍵數據**,
So that **我可以快速了解目前的待辦狀況與系統使用情形**.

## Acceptance Criteria

1. **統計卡片顯示 (Stat Cards Display)**
   - **Given** 使用者訪問 Dashboard 頁面，**When** 頁面載入完成，**Then** 應顯示 4 張統計卡片：
     - **腦同步天數 (Brain-Sync Days)**: 顯示寫過日記的總天數 (Mock: 42)。
     - **Inbox 未處理數**: 顯示 Pending Resources 數量 (Mock: 5)。
     - **進行中專案 (Active Projects)**: 顯示 Active 狀態的專案數 (Mock: 3)。
     - **待辦任務 (Total Tasks)**: 顯示未完成任務總量 (Mock: 12)。

2. **卡片內容設計 (Card Content)**
   - **Then** 每張卡片應包含：數據標題、主要數值 (大字顯示)、適當的 icon 圖示 (Lucide React)。

3. **資料介面預留 (Data Interface)**
   - **Given** 統計卡片目前使用 Mock Data，**When** 開發組件時，**Then** 應預留 `data props` 介面，以便後續替換為真實 RxDB 數據來源。

## Tasks / Subtasks

- [x] 建立 Dashboard 頁面
    - [x] 建立 `src/pages/DashboardPage.tsx`。
    - [x] 實作基本 Grid 佈局。
- [x] 實作 StatCard Component
    - [x] 建立 `src/components/dashboard/StatCard.tsx`。
    - [x] 定義 Props: `title`, `value`, `icon`, `description` (optional)。
    - [x] 使用 Shadcn/UI `Card` 元件作為基底。
- [x] 整合至 Dashboard
    - [x] 在 Dashboard 頁面引用 4 個 StatCard。
    - [x] 帶入 Mock Data。

## Dev Agent Record

### Implementation Plan
- 建立 `DashboardPage` 頁面與基礎佈局。
- 建立可複用的 `StatCard` 組件。
- 整合測試確保渲染正確。
- 更新 Router 與 Sidebar 導航。

### Debug Log
- 修正了測試檔案中的 import 路徑問題。
- 調整了 Grid 佈局以符合響應式需求。

### Completion Notes
- 完成 Dashboard 統計卡片開發。
- 使用 Shadcn/UI Card 組件確保視覺一致性。
- 已預留 Props 介面供未來 RxDB 資料串接。

## File List
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/components/dashboard/StatCard.tsx`
- `frontend/src/pages/__tests__/DashboardPage.test.tsx`
- `frontend/src/components/dashboard/__tests__/StatCard.test.tsx`
- `frontend/src/router.tsx` (Modified)
- `frontend/src/components/layout/Sidebar.tsx` (Modified)

## Change Log
- 2026-01-13: 初始實作 Dashboard 統計卡片 (Story 2.1)

## Status: review

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.1)
