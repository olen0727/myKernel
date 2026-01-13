# Story 1.4: App Layout & Placeholder Pages 頁面空殼與佈局

Status: review

## Story

As a **使用者**,
I want **所有頁面有一致的佈局結構，包含 Sidebar 和 TopBar**,
So that **我在不同頁面間導航時有一致的操作體驗**.

## Acceptance Criteria

1. **全站佈局 (App Layout)**
   - [x] 整合了 Sidebar (Story 1.1) 與 TopBar (Story 1.2)。
   - [x] 使用 `<Outlet />` 製作子路徑渲染區域。
   - [x] 建立了中央內容容器，並具有自適應寬度與 Padding。

2. **頁面空殼 (Placeholder Pages)**
   - [x] 實作了所有核心頁面的基礎樣式。
   - [x] SettingsPage 已擴充 Tabs 與 Card 結構。
   - [x] InboxPage 與其他頁面具備 Page Header (H1 + Description)。

3. **麵包屑導航 (Breadcrumb)**
   - [x] 實作了自動化動態麵包屑：會根據當前 URL 路徑 (e.g. `/projects/123`) 自動生成 `Home > Projects > 123`。
   - [x] 支援點擊 Breadcrumb 項目進行導覽。

## Tasks / Subtasks

- [x] 實作 AppLayout Component
    - [x] 建立 `src/layouts/AppLayout.tsx`。
    - [x] 整合 `Sidebar` 與 `TopBar`。
- [x] 實作 TopBar 優化
    - [x] 加入 **Dynamic Breadcrumb** 元件 (Shadcn/UI)。
    - [x] 確保主題切換與搜尋框佈局正確。
- [x] 實作各類頁面優化
    - [x] 統一頁面 Header 樣式。
    - [x] 實作 Settings 頁面的 Tabs 佈局。

## Dev Notes

### Architecture & Tech Stack
- **Routing Integration**: 使用 `useLocation` 自動映射路由片段至 Breadcrumb。
- **UI Architecture**: AppLayout 採用 `flex` 佈局，主內容區使用 `overflow-auto` 以確保 Sidebar 固定。

### File List
- `src/layouts/AppLayout.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/ui/breadcrumb.tsx` (Shadcn)
*   `src/pages/SettingsPage.tsx`
*   `src/components/ui/tabs.tsx` / `card.tsx` (Shadcn)
