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

- [ ] 實作 HabitManager Component
    - [ ] 建立 `src/components/habits/HabitManager.tsx`。
    - [ ] 實作列表渲染。
- [ ] 實作 CreateHabitModal
    - [ ] 建立 `src/components/habits/CreateHabitModal.tsx`。
    - [ ] 頻率選擇邏輯 (Select + Checkbox group for days)。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Switch, Badge, Dialog, Form)。
- **Lib**: `react-hook-form`。

### File Structure Requirements
- `src/components/habits/HabitManager.tsx`: 主元件。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-4.3)
