# Story 2.5: Quick Capture Modal 快速捕捉視窗

Status: ready-for-dev

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

- [ ] 實作 QuickCapture Modal
    - [ ] 建立 `src/components/quick-capture-modal.tsx`。
    - [ ] 使用 Shadcn/UI `Dialog` 元件。
    - [ ] 實作 `Textarea` (autosize) 輸入框。
    - [ ] 實作底部簡易工具列 (按鈕 Mock)。
- [ ] 實作全域快捷鍵
    - [ ] 與 Command Palette 類似，使用 `useEffect` 監聽 `q` + `meta`/`ctrlKey`。
    - [ ] 建議將 QuickCapture 放置於 AppLayout 層級。
- [ ] 整合 "New Resource" 按鈕
    - [ ] 讓 Sidebar 上的按鈕也能控制 Modal 開啟狀態。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Dialog, Textarea, Toast)。
- **State**: Global state (Zustand) or Context might be needed if triggered from multiple places (Sidebar + Shortcut).

### File Structure Requirements
- `src/components/quick-capture-modal.tsx`: 快速捕捉視窗元件。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.5)
