# System Interface Contracts

**Version**: 1.0  
**Language**: TypeScript / Abstract Contract  
**Purpose**: 定義前端 UI 行為與後端服務操作之間的契約。此文件不綁定特定傳輸協議 (HTTP/REST/tRPC)，而是專注於 **Intent (意圖)** 與 **Data Shape (資料形狀)**。

> [!NOTE] 
> 實作時應嚴格遵守此處定義的 `Service Operation` 名稱與輸入輸出型別。

---

## **Shared Core Types**

全系統共用的基礎型別定義。

```typescript
type UUID = string;
type DateTime = string; // ISO 8601 string

// 通用回應結構 (若使用 REST 時參考，tRPC 可直接回傳 Data)
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 分頁參數 (通用)
interface PaginationParams {
  page?: number;     // default: 1
  limit?: number;    // default: 20
}

// 基礎實體參照 (詳細欄位請對照 dataModel.md)
interface Resource { id: UUID; status: 'pending' | 'processed' | 'archived'; /* ... */ }
interface Project { id: UUID; status: 'active' | 'completed' | 'archived'; /* ... */ }
interface Area { id: UUID; status: 'active' | 'hidden'; /* ... */ }
interface Task { id: UUID; isCompleted: boolean; /* ... */ }
```

---

## **1. Resource & Inbox (資源與收件匣)**

### **Domain Types**

```typescript
// 資源狀態
type ResourceStatus = 'pending' | 'processed' | 'archived';

// DTO: 建立資源
interface CreateResourceDTO {
  title?: string;         // 若 Quick Capture 解析出標題則填入
  content: string;        // Markdown 內容或純文字
  sourceLink?: string;    // 若捕捉的是 URL
}

// DTO: 更新資源 (用於編輯或分流)
interface UpdateResourceDTO {
  id: UUID;
  title?: string;
  content?: string;
  sourceLink?: string;
  status?: ResourceStatus;
  
  // 關聯操作 (全量替換或差量更新，視實作而定，此處定義為最終狀態)
  linkedProjectIds?: UUID[];
  linkedAreaIds?: UUID[];
  tags?: string[];
}

// DTO: 搜尋參數
interface SearchResourceParams extends PaginationParams {
  query?: string;         // 全文檢索
  status?: ResourceStatus[]; 
  projectId?: UUID;
  areaId?: UUID;
  tagId?: UUID;
}
```

### **Contracts**

#### **1.1 快速捕捉 (Quick Capture)**
- **User Action**: 用戶按下全域快捷鍵 (如 `Cmd+Q`)，在彈窗輸入文字/網址後按下 Enter。
- **Operation**: `ResourceService.quickCapture`
- **Input**: `{ rawInput: string }`
- **Output**: `Resource` (回傳新建立的資源，狀態預設為 `Pending`)

#### **1.2 讀取收件匣 (Get Inbox)**
- **User Action**: 用戶進入「Inbox」頁面。
- **Operation**: `ResourceService.getPendingList`
- **Input**: `PaginationParams` (通常 Inbox 不分頁，但保留擴充性)
- **Output**: `Resource[]`

#### **1.3 資源分流與編輯 (Dispatch & Update)**
- **User Action**: 用戶在資源編輯頁選擇了關聯專案/領域，或手動修改標題內文，並儲存。
- **Contract Note**: 若使用者建立了關聯，前端應自動將 `status` 設為 `processed`。
- **Operation**: `ResourceService.update`
- **Input**: `UpdateResourceDTO`
- **Output**: `Resource` (更新後的資源)

#### **1.4 刪除資源 (Delete)**
- **User Action**: 用戶點擊垃圾桶圖示。
- **Operation**: `ResourceService.delete` (Soft Delete)
- **Input**: `{ id: UUID }`
- **Output**: `void` | `SuccessResponse`

#### **1.5 搜尋資源庫 (Search Library)**
- **User Action**: 用戶在「Resources」頁面輸入關鍵字或點擊標籤篩選。
- **Operation**: `ResourceService.search`
- **Input**: `SearchResourceParams`
- **Output**: `Resource[]`

---

## **2. Projects (專案管理)**

### **Domain Types**

```typescript
// DTO: 建立專案
interface CreateProjectDTO {
  name: string;
  areaId?: UUID;       // 歸屬領域
  dueDate?: DateTime;
  description?: string;
}

// DTO: 更新專案
interface UpdateProjectDTO {
  id: UUID;
  name?: string;
  areaId?: UUID | null; // null 代表移除關聯
  status?: 'active' | 'completed' | 'archived';
  dueDate?: DateTime | null;
  description?: string;
  progress?: number;    // 雖然通常由後端計算，但也允許手動校正
}

// Response: 專案詳情聚合
interface ProjectDetailResponse {
  project: Project;
  taskLists: (TaskList & { tasks: Task[] })[]; // 巢狀結構方便前端渲染
  relatedResources: Resource[];
}

// Response: 工作台資料
interface WorkbenchResponse {
  doing: Task[]; // 用戶手動標記為 Doing 的任務
  todo: Task[];  // 來自 Active Projects 的待辦任務聚合
}
```

### **Contracts**

#### **2.1 獲取專案列表 (Get Projects)**
- **User Action**: 用戶進入「Projects」清單頁。
- **Operation**: `ProjectService.getList`
- **Input**: `{ status?: 'active' | 'completed' | 'archived' }`
- **Output**: `Project[]`

#### **2.2 工作台概覽 (Get Workbench)**
- **User Action**: 用戶在 Project 頁面上半部查看今日焦點。
- **Operation**: `ProjectService.getWorkbench`
- **Input**: `void`
- **Output**: `WorkbenchResponse`

#### **2.3 獲取專案詳情 (Get Detail)**
- **User Action**: 用戶點擊特定專案卡片進入詳情頁。
- **Operation**: `ProjectService.getDetail`
- **Input**: `{ id: UUID }`
- **Output**: `ProjectDetailResponse`

#### **2.4 建立專案 (Create)**
- **User Action**: 用戶點擊「New Project」按鈕並提交 Modal。
- **Operation**: `ProjectService.create`
- **Input**: `CreateProjectDTO`
- **Output**: `Project` (建立後前端跳轉至詳情頁)

#### **2.5 修改專案屬性 (Update)**
- **User Action**: 用戶在詳情頁修改標題、截止日期或狀態 (封存)。
- **Operation**: `ProjectService.update`
- **Input**: `UpdateProjectDTO`
- **Output**: `Project`

#### **2.6 刪除專案 (Delete)**
- **User Action**: 用戶在設定選單選擇「Delete Project」。
- **Operation**: `ProjectService.delete` (Hard Delete)
- **Input**: `{ id: UUID }`
- **Output**: `void`

---

## **3. Tasks (任務管理)**

### **Domain Types**
```typescript
interface CreateTaskDTO {
  projectId: UUID;
  taskListId?: UUID; // 若無則放入預設清單
  description: string;
}

interface UpdateTaskDTO {
  id: UUID;
  description?: string;
  isCompleted?: boolean;
  order?: number;      // 用於排序
  taskListId?: UUID;   // 用於在清單間移動
}
```

### **Contracts**

#### **3.1 建立任務 (Create Task)**
- **User Action**: 用戶在專案任務清單下方輸入文字並 Enter。
- **Operation**: `TaskService.create`
- **Input**: `CreateTaskDTO`
- **Output**: `Task`

#### **3.2 更新任務狀態/內容 (Update Task)**
- **User Action**: 用戶勾選完成、修改文字或拖曳排序。
- **Operation**: `TaskService.update`
- **Input**: `UpdateTaskDTO`
- **Output**: `Task`

#### **3.3 刪除任務 (Delete Task)**
- **User Action**: 用戶點擊任務旁的垃圾桶圖示。
- **Operation**: `TaskService.delete`
- **Input**: `{ id: UUID }`
- **Output**: `void`

---

## **4. Areas (領域與習慣)**

### **Domain Types**
```typescript
interface CreateAreaDTO {
  name: string;
  coverImage?: string; // URL or Predefined Style ID
}

interface AreaDetailResponse {
  area: Area;
  habits: Habit[];
  activeProjects: Project[];
  resources: Resource[]; // Pinned resources
}
```

### **Contracts**

#### **4.1 獲取領域列表 (Get List)**
- **User Action**: 用戶進入「Areas」頁面。
- **Operation**: `AreaService.getList`
- **Input**: `void`
- **Output**: `(Area & { stats: { projectCount: number, habitCount: number } })[]`

#### **4.2 獲取領域詳情 (Get Detail)**
- **User Action**: 用戶進入特定領域頁面。
- **Operation**: `AreaService.getDetail`
- **Input**: `{ id: UUID }`
- **Output**: `AreaDetailResponse`

#### **4.3 建立/更新/刪除領域 (CRUD)**
- **Operations**: `AreaService.create`, `AreaService.update`, `AreaService.delete`
- **Inputs**: `CreateAreaDTO`, `UpdateAreaDTO`, `{ id: UUID }`

---

## **5. Journal & Metrics (日記與指標)**

### **Domain Types**
```typescript
interface JournalDetailResponse {
  journal: Journal;       // 當日日記實體
  habitLogs: HabitLog[];  // 當日習慣執行紀錄
  metricEntries: MetricEntry[]; // 當日指標數據
  footprints: {           // 當日資源足跡
    created: Resource[];
    processed: Resource[];
  };
}

interface RecordMetricDTO {
  date: DateTime; // YYYY-MM-DD
  metricId: UUID;
  value: number | string; // 視指標類型而定
}
```

### **Contracts**

#### **5.1 獲取日記視圖 (Get Journal)**
- **User Action**: 用戶切換至特定日期。
- **Operation**: `JournalService.getDailyView`
- **Input**: `{ date: DateTime }` (YYYY-MM-DD)
- **Output**: `JournalDetailResponse`

#### **5.2 寫入每日筆記 (Update Daily Note)**
- **User Action**: 用戶在 Daily Note 區域打字 (Auto-save)。
- **Operation**: `JournalService.updateNote`
- **Input**: `{ date: DateTime, content: string }`
- **Output**: `Journal`

#### **5.3 習慣打卡 (Toggle Habit)**
- **User Action**: 用戶勾選習慣。
- **Operation**: `HabitService.toggleLog`
- **Input**: `{ habitId: UUID, date: DateTime, isCompleted: boolean }`
- **Output**: `HabitLog`

#### **5.4 記錄指標 (Record Metric)**
- **User Action**: 用戶填寫數值或移動滑桿。
- **Operation**: `MetricService.recordEntry`
- **Input**: `RecordMetricDTO`
- **Output**: `MetricEntry`

---

## **6. User & Settings (使用者設定)**

### **Contracts**

#### **6.1 獲取設定 (Get Settings)**
- **User Action**: 進入設定頁面。
- **Operation**: `UserService.getSettings`
- **Input**: `void`
- **Output**: `User` (包含偏好設定欄位)

#### **6.2 更新設定 (Update Settings)**
- **User Action**: 切換主題或語言。
- **Operation**: `UserService.updateSettings`
- **Input**: `{ preferences: UserPreferences }`
- **Output**: `User`
