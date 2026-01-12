# Story 1.3: React Router 路由系統

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

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
     - `/projects` → `ProjectListPage`
     - `/projects/:id` → `ProjectDetailPage`
     - `/areas` → `AreaListPage`
     - `/areas/:id` → `AreaDetailPage`
     - `/resources` → `ResourceLibraryPage`
     - `/resources/:id` → `ResourceEditorPage`
     - `/journal` → `JournalPage`
     - `/journal/:date` → `JournalPage` (指定日期)
     - `/metrics` → `MetricsPage`
     - `/settings` → `SettingsPage`
     - `/login` → `LoginPage`

4. **404 處理 (Not Found Handling)**
   - **Given** 使用者訪問不存在的路由，**When** URL 不匹配任何定義的路由，**Then** 應顯示 404 頁面或重導向至首頁 (`/inbox`)。

## Tasks / Subtasks

- [ ] 安裝 React Router
    - [ ] 確認 `react-router-dom` 已安裝 (若未安裝需執行 `npm install react-router-dom`)。
- [ ] 建立頁面組件空殼 (Placeholders)
    - [ ] 建立 `src/pages/InboxPage.tsx`
    - [ ] 建立 `src/pages/ProjectListPage.tsx`
    - [ ] 建立 `src/pages/ProjectDetailPage.tsx`
    - [ ] 建立 `src/pages/AreaListPage.tsx`
    - [ ] 建立 `src/pages/AreaDetailPage.tsx`
    - [ ] 建立 `src/pages/ResourceLibraryPage.tsx`
    - [ ] 建立 `src/pages/ResourceEditorPage.tsx`
    - [ ] 建立 `src/pages/JournalPage.tsx`
    - [ ] 建立 `src/pages/MetricsPage.tsx`
    - [ ] 建立 `src/pages/SettingsPage.tsx`
    - [ ] 建立 `src/pages/LoginPage.tsx`
    - [ ] 建立 `src/pages/NotFoundPage.tsx`
- [ ] 設定 Router
    - [ ] 在 `src/App.tsx` 或 `src/router.tsx` 中使用 `createBrowserRouter` 或 `Routes` 定義路由表。
    - [ ] 設定 AppLayout 作為 Layout Route (包含 Sidebar 與 TopBar)。
    - [ ] 實作 `/` 重導向至 `/inbox`。

## Dev Notes

### Architecture & Tech Stack
- **Library**: `react-router-dom` (v6+)。
- **Structure**: 使用 Layout Route 模式，將 `Sidebar` 與 `TopBar` 放在 Layout 中，`Outlet` 渲染子頁面。

### File Structure Requirements
- `src/pages/*`: 存放頁面級組件。
- `src/App.tsx`: 應用程式入口與路由定義。
- `src/layouts/AppLayout.tsx`: 主要佈局元件。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-1.3)
