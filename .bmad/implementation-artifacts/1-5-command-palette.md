# Story 1.5: Command Palette 全域搜尋

Status: review

## Story

As a **使用者**,
I want **透過快捷鍵 Cmd+K 開啟全域搜尋面板，快速查找資源、專案、領域**,
So that **我可以快速導航至任何內容，不需要手動瀏覽選單**.

## Acceptance Criteria

1. **快捷鍵觸發 (Shortcut Trigger)**
   - [x] 按下 `Cmd+K` 或 `Ctrl+K` 可彈出面板。
   - [x] Modal 包含搜尋框並自動獲得焦點。

2. **UI 顯示與近期項目 (UI & Recent Items)**
   - [x] 顯示「近期開啟的項目」Mock Data。
   - [x] 清單項目顯示類型圖示與標題。

3. **即時搜尋 (Instant Search)**
   - [x] 整合了 `cmdk` 套件，支援即時過濾。
   - [x] 支援鍵盤上下鍵選擇。
   - [x] 按 Enter 導航至選中項目並關閉面板。

4. **關閉行為 (Closing Behavior)**
   - [x] 按下 `Esc` 或點擊外部可關閉面板。

5. **TopBar 整合**
   - [x] 點擊 TopBar 搜尋按鈕可開啟面板。

## Tasks / Subtasks

- [x] 安裝 `cmdk` 套件 (透過 Shadcn Command)
- [x] 實作 Command Palette Component
    - [x] 建立 `src/components/command-palette.tsx`。
    - [x] 實作快捷鍵監聽。
- [x] 整合與狀態管理
    - [x] 建立 `src/stores/command-store.ts` 管理開啟狀態。
    - [x] 在 `AppLayout` 中全域放置。
- [x] 整合至 TopBar
    - [x] 搜尋按鈕連動 `setOpen(true)`。

## Dev Notes

### Architecture & Tech Stack
- **Library**: `cmdk` via Shadcn UI.
- **State Management**: Zustand `useCommandStore` 用於連動 TopBar 與全域面板。
- **UX**: 實作了自動 Focus 搜尋框與導航後自動關閉。

### File List
- `src/stores/command-store.ts`
- `src/components/command-palette.tsx`
- `src/layouts/AppLayout.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/dialog.tsx`
