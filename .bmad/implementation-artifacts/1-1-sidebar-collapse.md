# Story 1.1: 側邊欄收折與響應式行為

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **側邊欄可以順暢地收折與展開，並在不同螢幕尺寸下有適當的響應式行為**,
So that **我可以根據需求調整工作區域大小，在小螢幕上也能有良好的操作體驗**.

## Acceptance Criteria

1. **桌面版收折/展開 (Desktop Collapse/Expand)**
   - **Given** 使用者在桌面裝置上，**When** 點擊收折按鈕，**Then** Sidebar 應以 300ms ease-in-out 動畫從 256px 收折至 64px。
   - **Then** 導航項目應隱藏文字，僅顯示圖示。
   - **Then** Logo 應從文字「Kernel」變更為單字母「K」。
   - **Then** 在收折狀態下滑鼠懸停於圖示時，應顯示 Tooltip 提示。

2. **行動裝置響應式 (< 768px)**
   - **Given** 使用者在行動裝置上，**When** 應用程式載入，**Then** Sidebar 應預設為收折 (隱藏) 狀態。
   - **Then** 應提供漢堡選單按鈕 (Hamburger menu) 以切換顯示/隱藏。
   - **When** 切換開啟時，Sidebar 可能會覆蓋內容或推擠內容 (標準 Mobile Drawer 行為)。

3. **近期項目區塊 (Recent Items Section)**
   - **Given** Sidebar 處於展開狀態，**When** 點擊 "Recent" 標題，**Then** 該區塊清單應可切換 (收折/展開)。

## Tasks / Subtasks

- [x] 實作 Sidebar 狀態管理 (Zustand/Context)
    - [x] 建立/更新 `useSidebarStore` 或本地 State，包含 `isCollapsed`, `toggleSidebar`。
    - [x] 將狀態持久化至 `localStorage`。
- [x] 重構/建立 `Sidebar.tsx` 元件
    - [x] 實作桌面版寬度過渡動畫 (256px <-> 64px, 300ms)。
    - [x] 實作 Logo 切換邏輯。
    - [x] 實作導航項目渲染 (Icon vs Icon+Text)。
    - [x] 整合 Shadcn/UI `Tooltip` 於收折狀態 use。
- [x] 實作行動版觸發器 (Mobile Trigger)
    - [x] 建立漢堡選單按鈕 (僅在行動裝置顯示)。
    - [x] 確保正確的響應式 Class (例如 `hidden md:flex`)。
- [x] 實作 "Recent" 區塊切換
    - [x] 為 "Recent" 增加 Collapsible 區塊功能。

## Dev Notes

### Architecture & Tech Stack
- **Framework**: React + Vite + TypeScript.
- **Styling**: Tailwind CSS.
- **UI Components**: Shadcn/UI (使用現有的 `Tooltip`, `Sheet`, `Button`, `Collapsible`)。
- **Icons**: Lucide React.
- **State**: 使用 `zustand` 配合 `persist` 中間件實現 `localStorage` 持久化。
- **Animation**: CSS Transitions (Tailwind classes 如 `transition-all duration-300 ease-in-out`)。

### File Structure Requirements
- `src/stores/sidebar-store.ts`: 狀態管理。
- `src/components/layout/Sidebar.tsx`: 主要元件（拆分為 Sidebar 與 SidebarContent 以便行動版重用）。
- `src/App.tsx`: 整合與行動版對齊。

### Implementation Plan
1.  安裝及配置 Vitest 測試環境。
2.  建立 `sidebar-store.ts` 與其單元測試。
3.  重構 `Sidebar.tsx` 以適配 Zustand 狀態並支援 `SidebarContent` 導出。
4.  更新 `App.tsx` 移除局部 `useState` 並加入 `SidebarMobileTrigger`。
5.  安裝 `sheet` 與 `collapsible` UI 元件。
6.  整合 `Collapsible` 於 "Recent" 區塊。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-1.1)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- 修正 `vite.config.ts` 中的 Vitest 類型錯誤（添加字串參考）。
- 修正 `Sidebar.tsx` 導入衝突與未使用的變數。

### Completion Notes List
- [x] Code implemented
- [x] Tests verified (3/3 passing)
- [x] UI refined (動畫與響應式邏輯已確認)

### File List
- `src/stores/sidebar-store.ts`
- `src/stores/__tests__/sidebar-store.test.ts`
- `src/components/layout/Sidebar.tsx`
- `src/App.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/collapsible.tsx`
- `vite.config.ts`
- `package.json`
- `src/test/setup.ts`
