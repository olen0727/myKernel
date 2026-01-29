# Story 5.8: Settings Page 設定頁面

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在設定頁面管理帳號與偏好**,
So that **我可以自定義應用程式體驗**.

## Acceptance Criteria

1. **頁面 Tab (Tabs)**
   - **Given** 訪問 `/settings`，**Then** 顯示 Tabs：General & Account, Appearance, Keyboard Shortcuts, Billing & Subscription。

2. **一般設定 (General & Account)**
   - **Then** 顯示 Profile (Name, Avatar) 編輯，Email (唯讀)。

3. **外觀設定 (Appearance)**
   - **Then** 顯示 Theme 切換 (Kernel Dark / Kernel Light Radio Group) 與字型選擇 (Inter / Roboto / Noto Sans TC)。

4. **快捷鍵列表 (Keyboard Shortcuts)**
   - **Then** 列出所有全域快捷鍵 (唯讀)：Quick Capture, Global Search, Previous Day, Next Day。

5. **帳單與訂閱 (Billing & Subscription)**
   - **Then** 顯示方案狀態 Badge, Upgrade 按鈕, 付款資訊。

## Tasks / Subtasks

- [x] 實作 SettingsPage
    - [x] 建立 `src/pages/SettingsPage.tsx`。
- [x] 實作 Settings Components
    - [x] `AccountSettings`, `AppearanceSettings`, `ShortcutList`, `BillingSettings`.

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Tabs, Select, Input, Card, Avatar, Button, Label)。

### File Structure Requirements
- `src/pages/SettingsPage.tsx`: 設定頁面。
- `src/components/settings/`: 設定子元件目錄。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.6)

## Dev Agent Record

### Implementation Notes
- Implemented `SettingsPage.tsx` using Shadcn Tabs with 4 tabs.
- Created modular components in `src/components/settings/`.
- Fixed missing `@radix-ui/react-avatar` dependency.
- Added integration tests in `SettingsPage.test.tsx` verifying all 4 tabs and content.

### Code Review Fixes (AI)
- [H1] Added Billing & Subscription tab with `BillingSettings` component (Epic 5.6 AC compliance).
- [H2] Changed Theme toggle from Switch to Radio Group (Kernel Dark / Kernel Light) per spec.
- [H3] Fixed font options to Inter / Roboto / Noto Sans TC per spec.
- [H4] Fixed shortcut list to match spec: Quick Capture (Ctrl/Cmd+Q), Global Search (Ctrl/Cmd+K), Previous Day (Ctrl/Cmd+[), Next Day (Ctrl/Cmd+]).
- [M1] Added `package-lock.json` to File List.
- [M2] Added unit tests for AppearanceSettings, ShortcutList, and BillingSettings.
- [M3] Updated Tab labels to match Epic spec: General & Account, Keyboard Shortcuts.
- [L2] Fixed "notifiable" typo to "available" in ShortcutList description.
- [L3] Updated shortcut display to use Ctrl/Cmd format for cross-platform support.

## File List
- frontend/src/pages/SettingsPage.tsx
- frontend/src/pages/SettingsPage.test.tsx
- frontend/src/components/settings/AccountSettings.tsx
- frontend/src/components/settings/AccountSettings.test.tsx
- frontend/src/components/settings/AppearanceSettings.tsx
- frontend/src/components/settings/AppearanceSettings.test.tsx
- frontend/src/components/settings/ShortcutList.tsx
- frontend/src/components/settings/ShortcutList.test.tsx
- frontend/src/components/settings/BillingSettings.tsx
- frontend/src/components/settings/BillingSettings.test.tsx
- frontend/package.json
- frontend/package-lock.json

## Change Log
- Implemented Settings Page with Tabs (General, Appearance, Shortcuts).
- Added Profile settings (Avatar, Name).
- Added Appearance settings (Theme, Font).
- Added Keyboard Shortcuts list.
- [Review] Added Billing & Subscription tab, fixed Theme to Radio Group, corrected font options and shortcut list per Epic 5.6 spec, added missing tests, updated Tab labels.
