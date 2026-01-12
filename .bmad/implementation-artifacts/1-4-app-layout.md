# Story 1.4: App Layout & Placeholder Pages 頁面空殼與佈局

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **所有頁面有一致的佈局結構，包含 Sidebar 和 TopBar**,
So that **我在不同頁面間導航時有一致的操作體驗**.

## Acceptance Criteria

1. **全站佈局 (App Layout)**
   - **Given** 使用者已登入並訪問任何受保護頁面，**When** 頁面載入，**Then** 應顯示完整的 AppLayout。
   - **Then** 左側應為 Sidebar (可收折，參考 Story 1.1)。
   - **Then** 頂部應為 TopBar (含 Breadcrumb、搜尋框、主題切換)。
   - **Then** 中央應為 MainContent 區域，渲染子路由內容。

2. **頁面空殼 (Placeholder Pages)**
   - **Given** 各頁面空殼已建立，**When** 使用者訪問各頁面，**Then** 應顯示對應的頁面標題與基本結構 (Empty State)：
     - InboxPage：標題「Inbox」+ Empty State 插圖/文字。
     - ProjectListPage：標題「Projects」+ Empty State。
     - AreaListPage：標題「Areas」+ Empty State。
     - ResourceLibraryPage：標題「Resources」+ Empty State。
     - JournalPage：標題「Journal」+ 日期顯示。
     - MetricsPage：標題「Metrics」+ Empty State。
     - SettingsPage：標題「Settings」+ Tabs 結構。
     - DashboardPage：標題「Dashboard」+ 卡片佈局 Placeholder。

3. **麵包屑導航 (Breadcrumb)**
   - **Given** TopBar 存在 Breadcrumb 區域，**When** 使用者切換頁面，**Then** Breadcrumb 應更新顯示當前頁面路徑名稱 (例如：Home > Projects 或 Home > Settings)。

## Tasks / Subtasks

- [ ] 實作 AppLayout Component
    - [ ] 建立 `src/layouts/AppLayout.tsx`。
    - [ ] 使用 CSS Grid 或 Flexbox 佈局 Sidebar, TopBar, Main Content。
    - [ ] 整合 `Sidebar` (Story 1.1) 與 `TopBar` (Story 1.2)。
    - [ ] 使用 `<Outlet />` 渲染子頁面。
- [ ] 實作 TopBar Component
    - [ ] 建立 `src/components/layout/TopBar.tsx`。
    - [ ] 加入 Breadcrumb 元件 (Shadcn/UI)。
    - [ ] 加入 Search Trigger 按鈕 (Story 1.5 預留)。
    - [ ] 加入 Theme Toggle (Story 1.2)。
- [ ] 實作各類頁面空殼
    - [ ] 為每個 Page Component 加入基本的 Tailwind 樣式與標題 (H1)。
    - [ ] 統一的 Page Container (Padding, Max-width)。

## Dev Notes

### Architecture & Tech Stack
- **Layout**: CSS Grid (Sidebar 固定寬度/Auto, Content 自適應)。
- **Components**: Shadcn/UI (Breadcrumb, Separator)。

### File Structure Requirements
- `src/layouts/AppLayout.tsx`: 主佈局。
- `src/components/layout/TopBar.tsx`: 頂部導航列。
- `src/components/layout/MainContent.tsx`: 內容包裹器 (可選)。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-1.4)
