# Story 4.6: Resource Dispatch & Smart Parse 資源分流與智慧解析

Status: ready-for-dev

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

- [ ] 實作 DispatchModal
    - [ ] 建立 `src/components/resources/DispatchModal.tsx`。
    - [ ] 復用 `Command` component 實作搜尋介面。
- [ ] 實作解析邏輯 (Utils)
    - [ ] 建立 `src/lib/content-parser.ts` (Mock logic for now)。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Command)。

### File Structure Requirements
- `src/components/resources/DispatchModal.tsx`: 分流選單。
- `src/lib/content-parser.ts`: 解析工具。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-4.6)
