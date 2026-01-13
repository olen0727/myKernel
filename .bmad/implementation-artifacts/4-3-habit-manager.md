# Story 4.3: Habit Manager 習慣管理器

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在領域內建立與管理習慣，設定頻率並控制啟用狀態**,
So that **我可以定義需要長期維持的行為承諾**.

## Acceptance Criteria

1. **習慣列表 (Habit List)**
   - **Given** Area Detail 頁面，**When** 習慣區塊載入，**Then** 應顯示習慣清單。
   - **Display**: 頻率標籤 (`[Daily]` / `[Weekly - Mon]`)、習慣名稱、啟用開關 (Toggle)、Edit/Delete 按鈕。

2. **新增習慣 (Create Habit)**
   - **Given** 點擊「+ Add Habit」，**When** 彈出 Modal，**Then** 填寫 Name、Frequency (Daily/Weekly)。
   - **Logic**: 若選 Weekly，需選擇星期 (Mon-Sun)。

3. **啟用控制 (Toggle Status)**
   - **Given** 切換習慣 Toggle，**Then** 狀態應即時更新 (Active/Paused)。Paused 項目應淡化顯示。

## Tasks / Subtasks

- [x] 實作 HabitManager Component
    - [x] 建立 `src/components/habits/HabitManager.tsx`。
    - [x] 實作列表渲染。
- [x] 實作 CreateHabitModal
    - [x] 建立 `src/components/habits/CreateHabitModal.tsx`。
    - [x] 頻率選擇邏輯 (Select + Checkbox group for days)。

### Review Follow-ups (AI)
- [x] [AI-Review][High] 整合 `mock-data-service` 以實現習慣數據持久化 `[src/components/habits/HabitManager.tsx]`
- [x] [AI-Review][Medium] 實作表單驗證，確保「每週」頻率下必須勾選至少一天 `[src/components/habits/CreateHabitModal.tsx]`
- [x] [AI-Review][Low] 重構 `HabitManager` 減少 `CreateHabitModal` 的重復實例代碼 `[src/components/habits/HabitManager.tsx]`

## Dev Agent Record (AI)

### Implementation Plan
1.  **Mock Data**: 更新 `mock-data-service.ts` 擴充 `Habit` 介面，增加 `frequency`、`days`、`areaId` 與 `status` 欄位。
2.  **Components**: 建立 `HabitManager` 與 `CreateHabitModal` 組件。
3.  **Integration**: 在 `AreaDetailPage` 的「習慣管理」分頁中整合 `HabitManager`。
4.  **Tests**: 撰寫單元測試驗證習慣新增與狀態切換。

### Completion Notes
- ✅ 實作 `CreateHabitModal` 組件，支援每天 (Daily) 與每週 (Weekly) 頻率選擇，並可為每週頻率勾選特定日期。
- ✅ 實作 `HabitManager` 組件，提供習慣清單、啟用/暫停狀態切換 (`Switch`) 以及單項習慣刪除與編輯入口。
- ✅ 將 `HabitManager` 整合至 `AreaDetailPage` 的「習慣管理」標籤頁中，實現基於領域 ID 的習慣過濾與管理。
- ✅ 通過 `HabitManager.test.tsx` 整合測試，驗證列表渲染、狀態切換與模態視窗開啟。

## File List
- `src/services/mock-data-service.ts` (Modified)
- `src/pages/AreaDetailPage.tsx` (Modified)
- `src/components/habits/HabitManager.tsx` (New)
- `src/components/habits/CreateHabitModal.tsx` (New)
- `src/components/habits/__tests__/HabitManager.test.tsx` (New)

## Change Log
- 2026-01-14: 開始實作 Habit Manager。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Switch, Badge, Dialog, Form)。
- **Lib**: `react-hook-form`。

### File Structure Requirements
- `src/components/habits/HabitManager.tsx`: 主元件。

### References
- [Architecture](../architecture.md)
- [Epics](../planning-artifacts/epics.md#Story-4.3)
