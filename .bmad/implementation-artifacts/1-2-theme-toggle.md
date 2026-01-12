# Story 1.2: TopBar Theme Toggle 主題切換

Status: ready-for-dev

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

- [ ] 實作 Theme Provider (Context)
    - [ ] 建立 `ThemeProvider` 與 `useTheme` hook。
    - [ ] 實作讀取/寫入 `localStorage` (key: `vite-ui-theme`) 的邏輯。
    - [ ] 實作系統偏好偵測 (`window.matchMedia('(prefers-color-scheme: dark)')`)。
    - [ ] 實作 DOM class 切換 (在 `html` 或 `body` tag 加上 `dark` class)。
- [ ] 實作 Theme Toggle Component
    - [ ] 使用 Shadcn/UI `DropdownMenu` 或簡單 `Button` 實作切換器。
    - [ ] 加入太陽與月亮圖示 (Lucide React)。
    - [ ] 實作點擊切換邏輯。
- [ ] 整合至 TopBar
    - [ ] 將 Theme Toggle 元件放置於 `TopBar` 右側區域。

## Dev Notes

### Architecture & Tech Stack
- **Styling**: Tailwind CSS Dark Mode (`class` strategy)。
- **State**: `localStorage`。
- **Component**: Shadcn/UI (Button, DropdownMenu - 若需要選單式切換)。

### File Structure Requirements
- `src/components/theme-provider.tsx`: Context Provider。
- `src/components/mode-toggle.tsx`: 切換按鈕元件。
- `src/components/layout/TopBar.tsx`: 整合位置。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-1.2)
