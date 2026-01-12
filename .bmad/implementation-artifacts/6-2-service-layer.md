# Story 6.2: Service Layer Encapsulation 服務層封裝

Status: ready-for-dev

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

- [ ] 實作 Service Factory
    - [ ] 建立 `src/services/index.ts` 統一導出單例。
- [ ] 實作各個 Service Class
    - [ ] `src/services/resource-service.ts`
    - [ ] `src/services/project-service.ts`
    - ...

## Dev Notes

### Architecture & Tech Stack
- **Pattern**: Repository/Service pattern.
- **Dependency Injection**: 簡單的 Singleton 模式或透過 React Context 注入。

### File Structure Requirements
- `src/services/*.ts`: 服務層檔案。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-6.2)
