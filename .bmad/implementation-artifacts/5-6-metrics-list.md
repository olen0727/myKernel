# Story 5.6: Metrics Management Page 指標管理列表

Status: ready-for-dev

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

- [ ] 實作 MetricsPage
    - [ ] 建立 `src/pages/MetricsPage.tsx`。
- [ ] 實作 MetricList Component
    - [ ] 列表渲染邏輯。
- [ ] 實作 CreateMetricModal
    - [ ] 建立 `src/components/metrics/CreateMetricModal.tsx`。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Table or Card list, Dialog, Form)。

### File Structure Requirements
- `src/pages/MetricsPage.tsx`: 指標管理頁。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.4)
