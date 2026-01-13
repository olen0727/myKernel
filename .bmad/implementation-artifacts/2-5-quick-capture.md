# Story 2.5: Quick Capture Modal 快速捕捉視窗

## Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **透過快捷鍵 Cmd+Q 開啟快速捕捉視窗，隨時記錄想法**,
So that **我可以不中斷當前工作流，快速保留靈感或資訊**.

## Acceptance Criteria

1. **快捷鍵與開啟 (Shortcut & Open)**
   - **Given** 使用者在應用程式任何頁面，**When** 按下 `Cmd+Q` (Mac) 或 `Ctrl+Q` (Windows)，**Then** 應彈出 Quick Capture Modal。
   - **Then** Modal 應置中顯示，背景有半透明遮罩 (Backdrop)。
   - **Then** 多行文字輸入框應自動獲得焦點。
   - **Note**: Sidebar 的 "New Resource" 按鈕也應觸發此 Modal。

2. **輸入與提交 (Input & Submit)**
   - **Given** 使用者在輸入框中輸入內容，**When** 按下 `Cmd+Enter` (Mac) 或 `Ctrl+Enter` (Windows)，**Then** Modal 應關閉。
   - **Then** 應顯示「已儲存至 Inbox」的 Toast 通知 (Mock 行為)。

3. **取消行為 (Cancel)**
   - **Given** Modal 已開啟，**When** 使用者按下 `Esc` 鍵或點擊外部遮罩，**Then** Modal 應關閉且不進行儲存。

## Tasks / Subtasks

- [x] 實作 QuickCapture Modal
    - [x] 建立 `src/components/quick-capture-modal.tsx`。
    - [x] 使用 Shadcn/UI `Dialog` 元件。
    - [x] 實作 `Textarea` 輸入框，並處理自動聚焦與鍵盤監聽。
    - [x] 實作底部工具列與儲存邏輯。
- [x] 實作全域快捷鍵
    - [x] 在 `AppLayout` 中實作 `Cmd/Ctrl+Q` 監聽。
    - [x] 整合 `useQuickCapture` 全域狀態。
- [x] 整合 "New Resource" 按鈕
    - [x] Sidebar 中的按鈕正確觸發 Modal 開啟。

## Dev Agent Record

### Implementation Plan
- 建立全域狀態 `useQuickCapture` 管理視窗開關。
- 實作 `QuickCaptureModal` 元件，包含高質感的 Dialog 設計與輸入體驗。
- 在 `AppLayout` 層級註冊 `Cmd+Q` (Mac) / `Ctrl+Q` (Win) 快捷鍵，確保任何頁面皆可觸發。
- 整合 `sonner` 通知系統 (Toast)，儲存後顯示回饋通知。
- 將 Sidebar 的 "New Resource" 按鈕與此 Modal 綁定。
- 建立單元測試確認視窗渲染、快捷鍵提交與關閉邏輯。

### Completion Notes
- 完成快速捕捉視窗開發。
- 支援 `Ctrl+Enter` 快速提交。
- 完成全域快捷鍵註冊。
- 單元測試全面通過。
- 透過 Code Review 優化：整合 Zustand Persist 中間件，確保輸入內容在頁面重新整理後不遺失。

## File List
- `frontend/src/components/quick-capture-modal.tsx`
- `frontend/src/stores/quick-capture-store.ts`
- `frontend/src/layouts/AppLayout.tsx`
- `frontend/src/components/layout/Sidebar.tsx`
- `frontend/src/components/__tests__/quick-capture-modal.test.tsx`

## Change Log
- 2026-01-13: 實作快速捕捉視窗 (Story 2.5)

## Status: review

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.5)
