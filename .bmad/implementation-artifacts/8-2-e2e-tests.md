# Story 8.2: E2E Tests & Security Audit E2E 測試與安全審計

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **開發者**,
I want **驗證關鍵使用者流程 (Critical User Journeys)**,
So that **確保系統整合後的穩定性**.

## Acceptance Criteria

1. **E2E 測試流程 (E2E Flows)**
   - **Then** 必須包含以下場景：
     - Login -> Dashboard -> Create Project -> Create Task.
     - Create Resource -> Dispatch -> Verify in Project/Area.
     - Journal Entry -> Habit Check -> Streak Update.

2. **安全性掃描 (Security Scan)**
   - **Then** 應執行 `npm audit` 確保無高風險漏洞。
   - **Then** 檢查 Database Encryption 是否生效 (Manual Verify)。

## Tasks / Subtasks

- [ ] 設定 Playwright (或 Cypress)
    - [ ] `npm init playwright@latest`。
- [ ] 撰寫 Critical Path Tests
    - [ ] `e2e/auth.spec.ts`。
    - [ ] `e2e/project-flow.spec.ts`。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `playwright`.

### File Structure Requirements
- `e2e/*.spec.ts`: E2E 測試。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-8.2)
- [Prerequisite] Story 6.4 (UI Integration) must be completed to ensure E2E tests run against real logic.
