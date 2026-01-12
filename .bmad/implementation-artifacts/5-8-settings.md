# Story 5.8: Settings Page 設定頁面

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在設定頁面管理帳號與偏好**,
So that **我可以自定義應用程式體驗**.

## Acceptance Criteria

1. **頁面 Tab (Tabs)**
   - **Given** 訪問 `/settings`，**Then** 顯示 Tabs：General, Appearance, Shortcuts。

2. **一般設定 (General)**
   - **Then** 顯示 Profile (Name, Avatar) 編輯。

3. **外觀設定 (Appearance)**
   - **Then** 顯示 Theme 切換與字型選擇。

4. **快捷鍵列表 (Shortcuts)**
   - **Then** 列出所有全域快捷鍵 (唯讀)。

## Tasks / Subtasks

- [ ] 實作 SettingsPage
    - [ ] 建立 `src/pages/SettingsPage.tsx`。
- [ ] 實作 Settings Components
    - [ ] `AccountSettings`, `AppearanceSettings`, `ShortcutList`.

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Tabs, Select, Input)。

### File Structure Requirements
- `src/pages/SettingsPage.tsx`: 設定頁面。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.6)
