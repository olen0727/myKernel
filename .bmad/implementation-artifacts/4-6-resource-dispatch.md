# Story 4.6: Resource Dispatch & Smart Parse 資源分流與智慧解析

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **透過分流工具將資源關聯至專案或領域，並預覽智慧解析結果**,
So that **我可以快速將資訊歸位至 PARA 系統**.

## Acceptance Criteria

1. **分流工具選單 (Dispatch Menu)**
   - **Given** 使用者點擊「+ Link」按鈕，**Then** 彈出 Command Palette 形式選單 (Dispatch Modal)。
   - **Then** 包含搜尋框、Projects 區段、Areas 區段。
   - **When** 選擇項目，**Then** 支援多選並顯示勾選標記。

2. **分流狀態更新 (Status Update)**
   - **Given** 資源原為 Pending 狀態，**When** 建立至少一個 Project/Area 關聯，**Then** 狀態自動轉為 Processed。

3. **智慧解析邏輯 (Smart Parse)**
   - **Given** Quick Capture 輸入純 URL，**Then** 顯示 Mock 解析結果 (Title/Meta)。
   - **Given** 混合內容，**Then** 第一行設為 Title，其餘為 Content。

## Tasks / Subtasks

- [x] 實作 DispatchModal
    - [x] 建立 `src/components/resources/DispatchModal.tsx`。
    - [x] 復用 `Command` component 實作搜尋介面。
- [x] 實作解析邏輯 (Utils)
    - [x] 建立 `src/lib/content-parser.ts` (Mock logic for now)。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Command)。

### File Structure Requirements
- `src/components/resources/DispatchModal.tsx`: 分流選單。
- `src/lib/content-parser.ts`: 解析工具。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-4.6)

## Dev Agent Record

### Completion Notes
- Implemented `DispatchModal` (refactored from `DispatchDialog`) with Command palette UI, search, and multi-selection for Projects/Areas.
- Implemented `content-parser.ts` with mock smart parsing for URLs and mixed content.
- Integrated Smart Parse into `QuickCaptureModal` to provide live previews (Link vs Note detection).
- Added unit tests for parser logic.

## File List
- frontend/src/components/resources/DispatchModal.tsx
- frontend/src/lib/content-parser.ts
- frontend/src/components/quick-capture-modal.tsx
- frontend/src/lib/__tests__/content-parser.test.ts

### Review Follow-ups (AI)
- [x] [AI-Review][HIGH] H5: 狀態自動轉換未實作 - 已在 ResourceSidebar 實作 Dispatch 後自動轉 processed
- [x] [AI-Review][MEDIUM] M4: Status 命名不一致 - AC 用 Pending ≈ inbox，已確認語義一致
- [x] [AI-Review][MEDIUM] M5: content-parser 測試不足 - 已補充 15+ edge cases 測試
- [x] [AI-Review][LOW] L1: DispatchModal 關閉時狀態未清空 - 已修復 reset selectedIds

## Change Log
- 2026-01-23: AI Code Review - 所有 4 個問題已修復 (1 HIGH, 2 MEDIUM, 1 LOW)
- 2026-01-20: Completed Resource Dispatch tools and Smart Parse integration.
