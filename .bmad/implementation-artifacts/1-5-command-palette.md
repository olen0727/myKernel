# Story 1.5: Command Palette 全域搜尋

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **透過快捷鍵 Cmd+K 開啟全域搜尋面板，快速查找資源、專案、領域**,
So that **我可以快速導航至任何內容，不需要手動瀏覽選單**.

## Acceptance Criteria

1. **快捷鍵觸發 (Shortcut Trigger)**
   - **Given** 使用者在應用程式任何頁面，**When** 按下 `Cmd+K` (Mac) 或 `Ctrl+K` (Windows)，**Then** 應彈出 Command Palette Modal。
   - **Then** Modal 應包含搜尋輸入框，且自動獲得焦點 (Auto-focus)。

2. **UI 顯示與近期項目 (UI & Recent Items)**
   - **Given** Command Palette 已開啟且未輸入文字，**When** Modal 顯示，**Then** 應顯示「近期開啟的項目」清單 (Mock Data，最多 10 項)。
   - **Then** 清單項目應顯示類型圖示 (Project/Area/Resource) 與標題。

3. **即時搜尋 (Instant Search)**
   - **Given** Command Palette 已開啟，**When** 使用者輸入搜尋文字，**Then** 清單應即時過濾顯示匹配的項目 (Mock 搜尋邏輯)。
   - **Then** 應支援鍵盤上下鍵選擇項目 (Arrow Navigation)。
   - **Then** 按 Enter 應導航至選中項目。

4. **關閉行為 (Closing Behavior)**
   - **Given** Command Palette 已開啟，**When** 使用者按下 `Esc` 或點擊 Modal 外部，**Then** Command Palette 應關閉。

5. **TopBar 整合**
   - **Given** 使用者點擊 TopBar 的搜尋框/按鈕，**When** 點擊發生，**Then** 應開啟 Command Palette (與快捷鍵行為一致)。

## Tasks / Subtasks

- [ ] 安裝 `cmdk` 套件
    - [ ] 執行 `npm install cmdk` (Shadcn/UI `Command` 元件依賴)。
- [ ] 實作 Command Palette Component
    - [ ] 建立 `src/components/command-palette.tsx`。
    - [ ] 使用 Shadcn/UI `CommandDialog` 元件。
    - [ ] 實作 `useEffect` 監聽 `keydown` 事件 (`k` + `meta`/`ctrlKey`) 控制開啟/關閉。
    - [ ] 實作 Mock Data 列表與過濾邏輯。
- [ ] 整合與狀態管理
    - [ ] 將 Command Palette 放置於 `AppLayout` 或 `App` 層級，確保全域可用。
    - [ ] 實作導航邏輯 (選擇項目後 `navigate` 並關閉 Modal)。
- [ ] 整合至 TopBar
    - [ ] 讓 TopBar 的搜尋按鈕呼叫開啟 Command Palette 的函式 (可能需要 Context 或 Zustand)。

## Dev Notes

### Architecture & Tech Stack
- **Library**: `cmdk` (透過 Shadcn/UI `Command` 元件)。
- **State**: `useState` (open/close) + `useEffect` (shortcut)。
- **Mock Data**: 暫時使用靜態陣列模擬搜尋結果。

### File Structure Requirements
- `src/components/command-palette.tsx`: 搜尋面板元件。
- `src/components/ui/command.tsx`: Shadcn/UI 原生元件。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-1.5)
