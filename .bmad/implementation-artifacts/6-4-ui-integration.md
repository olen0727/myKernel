# Story 6.4: UI Integration with Service Layer UI 服務層整合

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **應用程式的介面顯示來自真實資料庫的內容**,
So that **我的資料可以被永久儲存，並且在重整後不會消失**.

## Acceptance Criteria

1. **移除 Mock Data (Remove Mock Data)**
   - **Then** 所有 UI Component 不應再 import `mock-data-service.ts` 中的常數 (如 `INITIAL_PROJECTS`, `DASHBOARD_STATS`)。
   - **Then** `mock-data-service.ts` 應被標記為 deprecated 或移除 (除了測試用途)。

2. **服務層串接 (Service Integration)**
   - **Given** 使用者在介面上操作，**Then** 應呼叫 `services/index.ts` 中導出的 `services` 實例方法。
   - **Read**: 必須使用 Observable 模式訂閱資料變更，確保 UI 即時響應。
   - **Write**: 必須呼叫 Service 的 create/update/delete 方法。

3. **空狀態處理 (Empty States)**
   - **Given** 資料庫為空 (全新安裝)，**Then** UI 應顯示適當的引導訊息或空狀態，而不是崩潰。

## Tasks / Subtasks

- [ ] **Core / Hooks**
    - [x] 建立 `useObservable` hook (若尚未存在) 以簡化 Component 內的訂閱邏輯。
    - [x] 建立 `DataSeeder` (可選) 於 App 啟動時寫入一些預設資料供測試。
- [ ] **Dashboard Integration**
    - [x] `DashboardPage`: 改為從 `MetricService`, `HabitService`, `TaskService`, `ResourceService` 聚合數據。
- [ ] **Project Module Integration**
    - [x] `ProjectListPage`: 連接 `ProjectService.getAll()`。
    - [x] `ProjectDetailPage`: 連接 `ProjectService.getById()` 與 `TaskService` (取得關聯任務)。
- [ ] **Resource / Inbox Integration**
    - [x] `InboxPage`: 連接 `ResourceService` (篩選沒有 Project 的項目)。
    - [x] `ResourceLibraryPage`: 連接 `ResourceService.getAll()`。
- [x] **Area Module Integration**
    - [x] `AreaListPage`: 連接 `AreaService.getAll()`。
    - [x] `AreaDetailPage`: 顯示關聯的 Projects 和 Habits。
- [x] **Journal & Habit Integration**
    - [x] `JournalPage`: 連接 `LogService` 與 `HabitService` (顯示當日紀錄)。
    - [x] `HabitTracker`: 實作習慣打卡與 Streak 計算邏輯 (使用真實 DB 數據)。
- [x] **Settings Integration**
    - [x] 確認設定頁面 (如 Theme, Data Management) 功能正常。

## Dev Notes

### Implementation Guide
- 使用 `RxDB` 的 `$`後綴屬性 (Observable) 搭配 React Hook。
- 例如: `const projects = useObservable(services.project.getAll()) || []`.
- 注意非同步資料的 Loading 狀態。

### Dependencies
- Story 6.2 (Service Layer) 必須先完成。

## Change Log
- 2026-01-30: Created story to bridge the gap between backend services and frontend UI.
