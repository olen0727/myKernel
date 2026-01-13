# Story 1.2: TopBar Theme Toggle 主題切換

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在 TopBar 上有主題切換按鈕，可以在深色與淺色模式間切換**,
So that **我可以根據環境光線或個人偏好選擇舒適的介面主題**.

## Acceptance Criteria

1. **按鈕顯示與狀態 (Display & State)**
   - **Given** 使用者在任何頁面檢視 TopBar，**When** TopBar 載入，**Then** 應在右側顯示主題切換按鈕 (太陽/月亮圖示)。
   - **Then** 按鈕應反映當前主題狀態 (例如：深色模式顯示月亮，淺色模式顯示太陽，或相反)。

2. **切換行為 (Toggle Behavior)**
   - **Given** 使用者處於深色模式 (Reflective Dawn)，**When** 使用者點擊主題切換按鈕，**Then** 介面應即時切換至淺色模式。
   - **Then** 主題偏好應儲存至 `localStorage`。
   - **Then** 下次訪問或重新整理頁面時，應自動套用儲存的主題。

3. **系統預設值 (System Preference)**
   - **Given** 使用者首次訪問且無儲存偏好，**When** 系統偵測到使用者的系統主題偏好 (OS 設定)，**Then** 應自動套用系統偏好的主題。

## Tasks / Subtasks

- [x] 實作 Theme Provider (Context)
    - [x] 建立 `ThemeProvider` 與 `useTheme` hook。
    - [x] 實作讀取/寫入 `localStorage` (key: `vite-ui-theme`) 的邏輯。
    - [x] 實作系統偏好偵測 (`window.matchMedia('(prefers-color-scheme: dark)')`)。
    - [x] 實作 DOM class 切換 (在 `html` 或 `body` tag 加上 `dark` class)。
- [x] 實作 Theme Toggle Component
    - [x] 使用 Shadcn/UI `DropdownMenu` 或簡單 `Button` 實作切換器。
    - [x] 加入太陽與月亮圖示 (Lucide React)。
    - [x] 實作點擊切換邏輯。
- [x] 整合至 TopBar
    - [x] 將 Theme Toggle 元件放置於 `TopBar` 右側區域。

## Dev Notes

### Architecture & Tech Stack
- **Styling**: Tailwind CSS Dark Mode (`class` strategy)。
- **State**: `localStorage`。
- **Component**: Shadcn/UI (Button, DropdownMenu)。

### File Structure Requirements
- `src/components/theme-provider.tsx`: Context Provider。
- `src/components/mode-toggle.tsx`: 切換按鈕元件。
- `src/components/layout/TopBar.tsx`: 整合位置。

### Implementation Plan
1. 實作並測試 `theme-provider.tsx`。
2. 安裝必要的 Shadcn/UI 組件 (`dropdown-menu`)。
3. 建立 `mode-toggle.tsx` 組件。
4. 在 `main.tsx` 中包裹 `ThemeProvider`。
5. 在 `TopBar.tsx` 中加入 `ModeToggle`。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-1.2)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- 確保 `ThemeProvider` 正確處理 "system" 主題與系統事件監聽（雖然目前僅為靜態偵測，但 API 已預留）。
- 導入 `dropdown-menu` 與處理 Lucide 圖示的動畫過渡邏輯。

### Completion Notes List
- [x] Code implemented
- [x] Tests verified (2/2 passing for ThemeProvider)
- [x] UI integrated in TopBar

### File List
- `src/components/theme-provider.tsx`
- `src/components/__tests__/theme-provider.test.tsx`
- `src/components/mode-toggle.tsx`
- `src/components/layout/TopBar.tsx`
- `src/main.tsx`
- `src/components/ui/dropdown-menu.tsx`
