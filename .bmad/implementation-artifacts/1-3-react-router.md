# Story 1.3: React Router 路由系統

Status: review

## Story

As a **使用者**,
I want **應用程式有完整的路由系統，讓我可以透過 URL 直接訪問各個頁面**,
So that **我可以使用瀏覽器的上一頁/下一頁、書籤功能，並能分享特定頁面連結**.

## Acceptance Criteria

1. **預設路由重導向 (Default Redirect)**
   - **Given** 使用者訪問根路徑 `/`，**When** 應用程式載入，**Then** 應重導向至 `/inbox` (預設首頁)。

2. **導航與 URL 同步 (Navigation Sync)**
   - **Given** 路由系統已設定，**When** 使用者點擊 Sidebar 導航項目，**Then** URL 應更新為對應路徑。
   - **Then** 頁面內容應切換而不重新載入整個應用程式 (SPA 行為)。

3. **路由定義 (Route Definitions)**
   - **Then** 各路由應對應正確頁面組件：
     - `/inbox` → `InboxPage`
     - `/projects`, `/projects/:id`
     - `/areas`, `/areas/:id`
     - `/resources`, `/resources/:id`
     - `/journal`, `/journal/:date`
     - `/metrics`, `/settings`, `/login`

4. **404 處理 (Not Found Handling)**
   - **Given** 使用者訪問不存在的路由，**Then** 應顯示 404 頁面。

## Tasks / Subtasks

- [x] 安裝 React Router (已內建於模板)
- [x] 建立頁面組件空殼 (Placeholders)
    - [x] 建立 Inbox, Projects, Areas, Resources, Journal, Metrics, Settings, Login, NotFound 等 12 個頁面。
- [x] 設定 Router
    - [x] 在 `src/router.tsx` 中定義路由表。
    - [x] 實作 `AppLayout` 作為 Layout Route (包含 Sidebar 與 TopBar)。
    - [x] 實作 `/` 重導向至 `/inbox`。
- [x] 整合導航元件
    - [x] 重構 `Sidebar.tsx` 使用 `NavLink`。
    *   [x] 確保 Active State 與路由同步。

## Dev Notes

### Architecture & Tech Stack
- **Library**: `react-router-dom` v6.23.1
- **Structure**: 使用 `createBrowserRouter`。實作了 `AppLayout` 包裹 `Outlet` 的結構，這保證了 Sidebar 與 TopBar 在頁面切換時不重繪。

### File List
- `src/router.tsx`
- `src/App.tsx`
- `src/layouts/AppLayout.tsx`
- `src/pages/*.tsx` (12 files)
- `src/components/layout/Sidebar.tsx`

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Completion Notes List
- [x] 使用 `RouterProvider` 簡化入口。
- [x] Sidebar 全面鏈結化。
- [x] 基礎頁面結構已就緒。
