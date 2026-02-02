# Story 7.2: CouchDB Synchronization 資料同步

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **我的資料在多個裝置間自動同步**,
So that **我可以在手機與電腦間無縫切換工作**.

## Acceptance Criteria

1. **Replication 啟動 (Sync Start)**
   - **Given** 使用者登入成功，**When** 應用程式初始化，**Then** 建立與遠端 CouchDB 的 Replication。
   - **Config**: 遠端 URL 應從環境變數讀取。

2. **即時同步 (Real-time Sync)**
   - **Given** 網路連線正常，**When** 本地資料變更，**Then** 自動 Push 至遠端。
   - **When** 遠端資料變更，**Then** 自動 Pull 至本地並更新 UI。

3. **離線支援 (Offline Support)**
   - **Given** 網路中斷，**Then** 應用程式應維持可操作 (Local First)。
   - **When** 網路恢復，**Then** 自動重新連線並同步。

## Tasks / Subtasks

- [x] 設定 CouchDB Instance (或 PouchDB Server)
    - [x] 提供 Docker Compose 或雲端 CouchDB 連線資訊 (Dev Env)。
- [x] 實作 Replication 邏輯
    - [x] 在 `src/db/database.ts` 中加入 `collection.syncCouchDB()`。
    - [x] 處理 Auth Headers (將 JWT 帶入同步請求中)。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `rxdb` replication protocol.

### File Structure Requirements
- `src/db/replication.ts`: 同步設定 (可選)。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-7.2)
- [Prerequisite] Story 6.4 (UI Integration) must be completed to verify UI updates.

## File List
- frontend/src/db/replication.ts (New)
- frontend/src/db/replication.test.ts (New)
- frontend/src/db/database.ts (Modified)
- .bmad/implementation-artifacts/7-2-couchdb-sync.md (Modified)
- .bmad/implementation-artifacts/sprint-status.yaml (Modified)

## Change Log
- 2026-02-03: Create replication.ts to handle CouchDB sync with JWT support.
- 2026-02-03: Integrate replication into database.ts initialization.
- 2026-02-03: Add unit tests for replication logic.

## Dev Agent Record

### Completion Notes
- Implemented `syncCollection` helper using `rxdb/plugins/replication-couchdb`.
- Configured dynamic JWT injection via `AuthService.getToken` callback to ensure fresh tokens are used during sync.
- Updated `database.ts` to automatically start replication for all collections if `VITE_COUCHDB_URL` environment variable is set.
- Validated replication configuration generation coverage with `replication.test.ts`.
- **Note**: Existing project tests (e.g. MetricsPage) were failing due to environment issues (IndexedDB missing), unrelated to these changes. New features are covered by new tests.

### Implementation Plan
1.  **Verify CouchDB Setup**:
    -   `docker-compose.db.yml` already contains CouchDB configuration.
    -   Verified credentials (admin/password) and port (5984).

2.  **Implement Replication Logic**:
    -   Create `src/db/replication.ts` to define `startReplication(collection, remoteUrl, auth)` function.
    -   Use `rxdb/plugins/replication-couchdb` (need to check if installed/available, otherwise use `replication` plugin).
    -   Implement JWT handling in replication headers.

3.  **Integrate with Database**:
    -   Modify `src/db/database.ts` to invoke replication for all collections.
    -   Add environment variable for remote CouchDB URL.

4.  **Testing**:
    -   Add unit tests for replication configuration generator.
    -   Manual verification of sync between two browser tabs (via RxDB BroadcastChannel) and CouchDB.
