# Kernel Interaction Contracts (API Specs)

本文件定義系統前端與後端之間的數據交互契約。所有定義皆以 TypeScript Interface 呈現輸入/輸出數據形狀，且不綁定特定傳輸協議 (如 REST 或 tRPC)。

---

## 1. 資源與收件匣 (Resource & Inbox)

### GetInboxList
- **Description**: 獲取所有狀態為 `Pending` 的資源列表。
- **Input**: None
- **Output**: `Resource[]` (參照 dataModel.md)

### QuickCapture
- **Description**: 透過智慧解析建立新資源。
- **Input**: `{ rawInput: string }`
- **Output**: `Resource`

### CreateResource
- **Description**: 手動建立完整資源。
- **Input**: `ResourceUpdateRequest`
- **Output**: `Resource`

### UpdateResource
- **Description**: 更新現有資源屬性 (含標題、內容、關聯、標籤、狀態)。
- **Input**: `ResourceUpdateRequest & { id: UUID }`
- **Output**: `Resource`

### DeleteResource
- **Description**: 刪除資源 (軟刪除)。
- **Input**: `{ id: UUID }`
- **Output**: `{ success: boolean }`

### SearchResources
- **Description**: 根據篩選條件檢索已處理資源。
- **Input**: `{ status?: 'processed'|'archived', projectId?: UUID, areaId?: UUID, tagIds?: string[], query?: string }`
- **Output**: `Resource[]`

---

## 2. 專案管理 (Projects & Tasks)

### GetProjectList
- **Description**: 獲取各狀態下的專案列表。
- **Input**: `{ status: 'active' | 'completed' | 'archived' }`
- **Output**: `Project[]`

### GetWorkbench
- **Description**: 獲取工作台聚合數據。
- **Input**: None
- **Output**: `{ doing: Task[], todo: Task[] }`

### GetProjectDetail
- **Description**: 獲取專案詳情（含任務清單與關聯資源）。
- **Input**: `{ id: UUID }`
- **Output**: `{ project: Project, taskLists: (TaskList & { tasks: Task[] })[], resources: Resource[] }`

### CreateProject / UpdateProject / DeleteProject
- **Description**: 專案的基本維護。
- **Contract**: 參照專案實體屬性。

### CreateTaskList / UpdateTaskList / DeleteTaskList
- **Description**: 專案下任務清單的維護。
- **Input**: `TaskList` 相關屬性與 `projectId`。

### CreateTask / UpdateTask / DeleteTask
- **Description**: 任務的增刪改、狀態切換與排序。
- **Input**: `Task` 相關屬性。

---

## 3. 領域維護 (Areas & Habits)

### GetAreaList
- **Description**: 獲取人生領域列表及簡易統計。
- **Input**: None
- **Output**: `(Area & { stats: { activeProjects: number, activeHabits: number } })[]`

### GetAreaDetail
- **Description**: 獲取領域詳情。
- **Input**: `{ id: UUID }`
- **Output**: `{ area: Area, habits: Habit[], projects: Project[], resources: Resource[] }`

### CreateArea / UpdateArea / DeleteArea
- **Description**: 人生領域的維護。
- **Contract**: 參照 Area 實體。

### CreateHabit / UpdateHabit / DeleteHabit
- **Description**: 習慣的定義與配置。
- **Contract**: 參照 Habit 實體。

---

## 4. 日記系統 (Journal)

### GetJournalDetail
- **Description**: 獲取特定日期的日記聚合視圖。
- **Input**: `{ date: Date }`
- **Output**: `{ journal: Journal, habitLogs: HabitLog[], metricEntries: MetricEntry[], footprints: Resource[] }`

### RecordDailyNote / ToggleHabit / RecordMetric
- **Actions**: 日記內文儲存、習慣打卡、指標數據錄入。
- **Contract**: 即時持久化數據形狀。

---

## 5. 指標與儀表板 (Metrics & Dashboard)

### GetMetricList
- **Description**: 獲取指標列表。

### CreateMetric / UpdateMetric / DeleteMetric
- **Description**: 指標定義的增刪改。
- **Input**: 參照 Metric 實體屬性。

### GetDashboardSummary / GetActivityHeatmap / GetMetricsTrend
- **Actions**: 視覺化數據聚合與趨勢分析。

---

## 6. 使用者與設定 (User & Settings)

### GetUserSettings / UpdateUserSettings
- **Actions**: 帳號資訊、顯示名稱、主題與字型偏好。

### ActivateReferralCode
- **Description**: 輸入推薦碼以切換為 `founder` 方案。
- **Input**: `{ code: string }`
- **Output**: `{ success: boolean, newPlan: string }`
