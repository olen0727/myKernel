# Story 8.1: Unit & Integration Tests 單元與整合測試

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **開發者**,
I want **擁有完整的自動化測試套件**,
So that **重構或新增功能時不會破壞既有邏輯**.

## Acceptance Criteria

1. **環境建置 (Test Setup)**
   - **Given** 專案環境，**When** 執行 `npm run test`，**Then** 應執行 Vitest。
   - **Config**: 支援 React Testing Library。

2. **核心邏輯測試 (Core Logic Tests)**
   - **Then** 必須包含以下測試：
     - Service Layer (Mock RxDB)
     - Utils (日期計算、URL 解析)
     - 關鍵 Hooks (useAuth, useTheme)

3. **覆蓋率 (Coverage)**
   - **Then** 生成覆蓋率報告，目標 Critical Path > 70%。

## Tasks / Subtasks

- [ ] 設定 Vitest
    - [ ] `vitest.config.ts`。
- [ ] 撰寫 Service Tests
    - [ ] `src/services/__tests__/*.test.ts`。
- [ ] 撰寫 Util Tests
    - [ ] `src/lib/__tests__/*.test.ts`。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `vitest`, `@testing-library/react`.

### File Structure Requirements
- `vitest.config.ts`: 測試設定。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-8.1)
