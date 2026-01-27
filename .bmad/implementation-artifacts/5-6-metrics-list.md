# Story 5.6: Metrics Management Page 指標管理列表

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **管理自定義指標的定義與屬性**,
So that **我可以定義需要長期追蹤的量化數據**.

## Acceptance Criteria

1. **指標列表 (Metrics List)**
   - **Given** 訪問 `/metrics`，**Then** 列表區分 Active 與 Archived。
   - **List Item**: 顯示 Name, Type (Number/Rating/Select/Time), 單位。

2. **新增指標 (Create Metric)**
   - **Given** 點擊「+ New Metric」，**Then** 開啟 Modal。
   - **Form**: Name (Required), Type (Select), Unit (Optional, for Number), Options (Optional, for Select).

3. **編輯與刪除 (Edit & Delete)**
   - **Given** 系統指標 (如 Sleep)，**Then** 不可刪除，但可停用。
   - **Given** 自定義指標，**Then** 可編輯或刪除 (需顯示資料遺失警告)。

## Tasks / Subtasks

- [x] 實作 MetricsPage
    - [x] 建立 `src/pages/MetricsPage.tsx`。
- [x] 實作 MetricList Component
    - [x] 列表渲染邏輯。
- [x] 實作 CreateMetricModal
    - [x] 建立 `src/components/metrics/CreateMetricModal.tsx`。
- [x] [AI-Review][HIGH] Implement "Edit Metric" functionality (AC 3). `src/components/metrics/MetricList.tsx`
- [x] [AI-Review][MEDIUM] Replace `window.confirm` with Shadcn AlertDialog.

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Table or Card list, Dialog, Form)。

### File Structure Requirements
- `src/pages/MetricsPage.tsx`: 指標管理頁。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.4)

## File List
- src/pages/MetricsPage.tsx
- src/pages/__tests__/MetricsPage.test.tsx
- src/components/metrics/MetricList.tsx
- src/components/metrics/__tests__/MetricList.test.tsx
- src/components/metrics/CreateMetricModal.tsx
- src/services/mock-data-service.ts

## Change Log
- 2026-01-27: Implemented MetricsPage with Active/Archived tabs.
- 2026-01-27: Implemented MetricList and CreateMetricModal components.
- 2026-01-27: Updated Mock Data Service to support metric management (Add/Update/Delete).
- 2026-01-27: Code Review performed. Action items created for missing Edit functionality and UI improvements.
- 2026-01-28: Implemented Edit functionality and AlertDialog.
