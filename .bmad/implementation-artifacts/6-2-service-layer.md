# Story 6.2: Service Layer Encapsulation 服務層封裝

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **開發者**,
I want **封裝所有資料庫操作於 Service Layer (如 ResourceService)**,
So that **UI 組件不直接依賴 RxDB，保持架構解耦與測試性**.

## Acceptance Criteria

1. **Service 介面 (Interfaces)**
   - **Then** 所有 Service 應繼承 BaseService 或實作統一 CRUD 介面。
   - **Methods**: `getAll`, `getById`, `create`, `update`, `delete`。

2. **核心 Services 實作 (Core Services)**
   - **Given** 應用程式需求，**Then** 需實作：
     - `ResourceService`: 處理資源 CRUD 與 Dispatch 邏輯。
     - `ProjectService`: 處理專案與進度計算。
     - `TaskService`: 處理任務與拖曳排序更新。
     - `HabitService`: 處理習慣與日誌 (Log)。
     - `MetricService`: 處理指標與輸入。

3. **Observable 支援 (Reactivity)**
   - **Then** Read methods 應支援回傳 Observable，以便 UI 透過 Hooks (`use-observable`) 自動更新。

## Tasks / Subtasks

- [x] 實作 Service Factory
    - [x] 建立 `src/services/index.ts` 統一導出單例。
- [x] 實作各個 Service Class
    - [x] `src/services/resource-service.ts`
    - [x] `src/services/project-service.ts`
    - [x] `src/services/task-service.ts`
    - [x] `src/services/habit-service.ts`
    - [x] `src/services/metric-service.ts`
    - [x] `src/services/log-service.ts`
    - [x] `src/services/area-service.ts`

## Dev Notes

### Architecture & Tech Stack
- **Pattern**: Repository/Service pattern.
- **Dependency Injection**: 簡單的 Singleton 模式或透過 React Context 注入。

### File Structure Requirements
- `src/services/*.ts`: 服務層檔案。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-6.2)
- [Project Context](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/implementation-artifacts/sprint-status.yaml)

## File List
- frontend/src/types/models.ts
- frontend/src/services/base-service.ts
- frontend/src/services/index.ts
- frontend/src/services/project-service.ts
- frontend/src/services/resource-service.ts
- frontend/src/services/task-service.ts
- frontend/src/services/habit-service.ts
- frontend/src/services/metric-service.ts
- frontend/src/services/log-service.ts
- frontend/src/services/area-service.ts
- frontend/src/services/__tests__/BaseService.test.ts
- frontend/src/services/__tests__/Services.test.ts

## Change Log
- 2026-01-29: Implemented Service Layer with BaseService and concrete services (Project, Resource, Task, Habit, Metric, Log, Area). Added unit and integration tests.
- 2026-01-30: Refactored database types for strict type safety. Removed `any` casting in services.
- 2026-01-30: Senior Developer Review - Approved.

## Senior Developer Review (AI)
- [x] Refactored `KernelDatabase` to use strict Collection mapping.
- [x] Removed `as any` casting in `ProjectService`.
- [x] Validated Service Factory pattern.
- **Outcome**: Approved.

## Dev Agent Record

### Implementation Plan
- Defined `BaseService` abstract class with common CRUD and RxDB integration.
- Implemented `ProjectService` with `recalculateProgress` logic.
- Implemented `HabitService` with `toggleCompletion` logic using `Log` entries.
- Implemented `MetricService` with `addEntry` logic.
- Created singleton factory in `index.ts` using lazy loading for async DB access.
- Added comprehensive tests for BaseService and ProjectService.

### Debug Log
- Fixed issue with `doc.patch` return value in `BaseService.update` (documents are immutable).
- Configured tests to use `rxdb/plugins/storage-memory` to bypass missing IndexedDB in test environment.
