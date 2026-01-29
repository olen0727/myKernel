# Story 6.1: RxDB Initialization & Schema RxDB 初始化與 Schema 定義

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **開發者**,
I want **初始化 RxDB 並定義所有資料模型的 JSON Schema**,
So that **應用程式可以正確地儲存、驗證與檢索資料**.

## Acceptance Criteria

1. **資料庫初始化 (DB Init)**
   - **Given** 應用程式啟動 (`DbProvider` mount)，**Then** 建立 `kernel_db`。
   - **Then** 使用 `idb` (IndexedDB) 作為儲存 adapter。

2. **Schema 定義 (Schema Definitions)**
   - **Then** 包含以下 Collections Schema：
     - `projects`: id, name, status, progress, areaId, ...
     - `areas`: id, name, coverImage, ...
     - `resources`: id, title, type, url, context...
     - `tasks`: id, title, completed, projectId...
     - `habits`: id, name, frequency, ...
     - `metrics`: id, name, type...
     - `logs`: id, date, value, metricId/habitId... (for habits & metrics history)
   - **Properties**: 每個 Schema 必須有 `id` (primary), `createdAt`, `updatedAt`, `version`。

3. **加密設定 (Encryption)**
   - **Then** 敏感欄位 (如 `content`, `note`) 設定 `encrypted: true` (預留介面，需配合密碼插槽)。

## Tasks / Subtasks

- [x] 安裝 RxDB
    - [x] `npm install rxdb rxjs`。
- [x] 實作 Schema 檔案
    - [x] 建立 `src/db/schemas/*.ts`。
- [x] 實作 Database Initializer
    - [x] 建立 `src/db/database.ts`。
    - [x] 實作 `createDatabase` 函式與 Collection 註冊。
- [x] 實作 React Provider
    - [x] 建立 `src/providers/DbProvider.tsx`。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `rxdb`。
- **Plugin**: `rxdb/plugins/dev-mode` (Dev only)。

### File Structure Requirements
- `src/db/schemas/project.schema.ts`: 專案 Schema。
- `src/db/database.ts`: 資料庫核心。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-6.1)
