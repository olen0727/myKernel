# Story 5.5: Resource Footprints 資源足跡

Status: done

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

- [x] 實作 FootprintList Component
    - [x] 建立 `src/components/journal/FootprintList.tsx`。
    - [x] 實作查詢邏輯 (Query resources where createdAt or updatedAt is today)。
- [x] [AI-Review][HIGH] Implement navigation to resource details on click (AC 2). `src/components/journal/FootprintList.tsx`
- [x] [AI-Review][MEDIUM] Improve resource summary generation in `mock-data-service.ts`.
- [x] [AI-Review][MEDIUM] Replace in-memory filtering with RxDB query when database is ready. (Deferred to Epic 6)

## Dev Notes

### Architecture & Tech Stack
- **DB**: RxDB Query (`$eq` today)。

### File Structure Requirements
- `src/components/journal/FootprintList.tsx`: 足跡列表。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-5.3)

## File List
- src/components/journal/FootprintList.tsx
- src/components/journal/__tests__/FootprintList.test.tsx
- src/pages/JournalPage.tsx
- src/pages/__tests__/JournalPage.test.tsx
- src/services/mock-data-service.ts

## Change Log
- 2026-01-27: Implemented FootprintList component to display created/modified resources. (Story 5.5)
- 2026-01-27: Integrated FootprintList into JournalPage.
- 2026-01-27: Added unit tests and mock data service logic.
- 2026-01-27: Code Review performed. Action items created for missing navigation and data improvements.
- 2026-01-28: Fixed navigation and summary generation.
