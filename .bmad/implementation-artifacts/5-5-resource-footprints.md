# Story 5.5: Resource Footprints 資源足跡

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在日記頁面看到當天建立或修改的資源足跡**,
So that **我可以回顧一天中接觸了哪些資訊與知識**.

## Acceptance Criteria

1. **足跡列表 (Footprint List)**
   - **Given** 日記頁面左側足跡區，**When** 區域載入，**Then** 應顯示當日「Created」或「Modified」的 Resource 列表。
   - **Then** 每筆資料包含：標題、操作類型 (Created/Modified 標籤)、時間戳記。

2. **互動 (Interaction)**
   - **Given** 足跡項目，**When** 點擊，**Then** 應開啟該資源的編輯頁或預覽窗格。

3. **無資料狀態 (Empty State)**
   - **Given** 當日無任何資源操作，**Then** 顯示「無資源足跡」的提示文字。

## Tasks / Subtasks

- [ ] 實作 FootprintList Component
    - [ ] 建立 `src/components/journal/FootprintList.tsx`。
    - [ ] 實作查詢邏輯 (Query resources where createdAt or updatedAt is today)。

## Dev Notes

### Architecture & Tech Stack
- **DB**: RxDB Query (`$eq` today)。

### File Structure Requirements
- `src/components/journal/FootprintList.tsx`: 足跡列表。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.3)
