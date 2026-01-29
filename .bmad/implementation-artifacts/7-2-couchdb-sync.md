# Story 7.2: CouchDB Synchronization 資料同步

Status: ready-for-dev

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

- [ ] 設定 CouchDB Instance (或 PouchDB Server)
    - [ ] 提供 Docker Compose 或雲端 CouchDB 連線資訊 (Dev Env)。
- [ ] 實作 Replication 邏輯
    - [ ] 在 `src/db/database.ts` 中加入 `collection.syncCouchDB()`。
    - [ ] 處理 Auth Headers (將 JWT 帶入同步請求中)。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `rxdb` replication protocol.

### File Structure Requirements
- `src/db/replication.ts`: 同步設定 (可選)。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-7.2)
- [Prerequisite] Story 6.4 (UI Integration) must be completed to verify UI updates.
