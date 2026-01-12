---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics"]
inputDocuments:
  - ".bmad/prd.md"
  - ".bmad/architecture.md"
  - "doc/3.UXUI.md"
  - "doc/2.1.dataModel.md"
  - "doc/2.2.interface_contracts.md"
  - "doc/4.designSystem.md"
  - "doc/Implementation_task.md"
---

# Kernel - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Kernel, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

| ID | 需求描述 | 來源 |
|----|----------|------|
| **FR1** | 使用者可透過 Google 或 GitHub OAuth 進行登入與註冊 | PRD 3.1.1, Architecture 7.1 |
| **FR2** | 使用者可透過全域快捷鍵 (Cmd+Q) 開啟快速捕捉視窗，輸入文字或 URL | PRD 1.3 Inbox, UXUI 3.2.3 |
| **FR3** | 系統須支援智慧解析：純 URL 輸入時自動抓取標題與內容；混合內容時第一行為標題 | UXUI 3.2.3 |
| **FR4** | 使用者可在 Inbox 中檢視所有 Pending 狀態的資源，並進行分流 (關聯至 Project/Area) | PRD 1.3 Inbox, UXUI 3.2.1 |
| **FR5** | 資源分流後狀態自動從 Pending 轉為 Processed | PRD 1.3 Resource, Data Model |
| **FR6** | 使用者可在資源編輯頁修改標題、內容、標籤，並管理關聯的 Project/Area | UXUI 3.2.2 |
| **FR7** | 使用者可建立、編輯、封存、刪除專案 (Project) | PRD 1.3 Project, UXUI 3.3 |
| **FR8** | 專案須支援多個任務清單 (TaskList)，每個清單包含可勾選的任務 (Task) | UXUI 3.3.2 |
| **FR9** | 專案進度須根據任務完成情況自動計算並顯示 | UXUI 3.3.2 |
| **FR10** | 使用者可在 Workbench 中查看跨專案的 Doing/Todo 任務聚合視圖 | UXUI 3.3.1 |
| **FR11** | 使用者可將任務從 Todo 拖曳至 Doing 區域標記為焦點任務 | UXUI 3.3.1 |
| **FR12** | 使用者可建立、編輯、隱藏、刪除領域 (Area) | PRD 1.3 Area, UXUI 3.4 |
| **FR13** | 領域須支援封面圖、描述，並顯示關聯的 Projects 與 Habits | UXUI 3.4.2 |
| **FR14** | 使用者可在領域下建立、編輯、啟用/暫停、刪除習慣 (Habit) | UXUI 3.4.2 |
| **FR15** | 習慣須支援 Daily 與 Weekly (指定星期幾) 兩種頻率 | Data Model |
| **FR16** | 使用者可在資源庫中搜尋、篩選已處理的資源 (按狀態、Project、Area、Tag) | UXUI 3.5.1 |
| **FR17** | 使用者可建立自定義指標 (Metric)，支援 Select/Number/Rating/Time/Sleep 五種類型 | UXUI 3.6 |
| **FR18** | 系統須提供內建的睡眠追蹤指標，自動計算睡眠時數 | UXUI 3.6.2 |
| **FR19** | 使用者可在日記 (Journal) 中檢視並填寫當日習慣與指標 | UXUI 3.7 |
| **FR20** | 日記須顯示當日資源足跡 (建立或修改過的資源) | UXUI 3.7.1 |
| **FR21** | 日記須支援日期導航，可切換至過去日期補填，但未來日期僅供檢視 | UXUI 3.7.2 |
| **FR22** | 儀表板須顯示系統運行狀況 (使用天數、Inbox 數、Active Projects、待辦任務) | UXUI 3.9.1 |
| **FR23** | 儀表板須顯示習慣熱力圖與連續達成天數 | UXUI 3.9.1 |
| **FR24** | 儀表板須支援指標趨勢圖表 (折線圖、散點圖) | UXUI 3.9.2 |
| **FR25** | 使用者可在設定頁面修改顯示名稱、頭像、主題、字型 | UXUI 3.8 |
| **FR26** | 全域搜尋 (Cmd+K) 須以 Command Palette 形式呈現，支援即時搜尋 | UXUI 3.0 |
| **FR27** | Sidebar 須支援收折/展開，收折後僅顯示圖示 | UXUI 3.0 |

### Non-Functional Requirements

| ID | 需求描述 | 來源 |
|----|----------|------|
| **NFR1** | 系統須支援多語系擴展，開發階段首先支援繁體中文 | PRD 2.3 |
| **NFR2** | 所有讀寫操作必須直接對本地資料庫進行，介面反應不得受網路延遲影響 (Local-First) | PRD 2.3 |
| **NFR3** | 網路恢復後，系統須在背景自動與遠端 CouchDB 完成雙向同步 | PRD 2.3 |
| **NFR4** | 多裝置產生衝突時，系統須具備預設合併策略 | PRD 2.3 |
| **NFR5** | 敏感數據必須經過 AES-256 加密，傳輸和儲存時都不能被未授權者讀取 | PRD 2.3, Architecture 14 |
| **NFR6** | 防止數據在儲存或傳輸過程中被惡意篡改或意外損壞 (完整性) | PRD 2.3 |
| **NFR7** | 基於用戶角色和權限，限制對特定數據和功能的訪問 (授權控制) | PRD 2.3 |
| **NFR8** | 抵禦 DDoS、SQL 注入、XSS 等 OWASP Top 10 攻擊 | PRD 2.3 |
| **NFR9** | 記錄所有安全相關事件及重要操作 (事件日誌) | PRD 2.3 |
| **NFR10** | 同步是隱形的，不顯示 Loading Spinner、「同步中」Toast、「已儲存」Toast | Architecture 11 |
| **NFR11** | 離線是自然的，不顯示「離線模式」Banner | Architecture 11 |
| **NFR12** | 本地寫入延遲須小於 10ms | Architecture 11 |
| **NFR13** | 全程採用 HTTPS/TLS 1.3 傳輸 | Architecture 14.2 |
| **NFR14** | 每個使用者在後端 CouchDB 擁有獨立的資料庫檔案，實體隔離數據 | PRD 2.3, Architecture 14.3 |

### Additional Requirements

#### Architecture Technical Requirements

- **Starter Template**: 使用 Vite + React + TypeScript 模板初始化專案 [Architecture 1.1]
- 禁止使用 `console.log`，須使用 `console.error` 或 `console.warn` [Architecture 12.1]
- 禁止使用 `any` 型別，必須定義明確型別 [Architecture 12.1]
- 禁止直接操作 RxDB，必須透過 Service Layer [Architecture 12.1]
- 使用 Path Alias: `@/components`, `@/lib` [Architecture 12.1]
- 使用 Functional Components，不使用 Class Components [Architecture 12.1]
- 優先使用 shadcn/ui 現有組件 [Architecture 12.1]
- 使用 TailwindCSS，不寫自定義 CSS [Architecture 12.1]
- 組件命名使用 PascalCase，Hooks 使用 camelCase + `use` prefix [Architecture 12.2]
- Services 使用 PascalCase + `Service` suffix [Architecture 12.2]
- 測試覆蓋率目標：Services 70%，Components 50% [Architecture 13.1]
- 使用 Vitest 進行單元測試，Playwright 進行 E2E 測試 [Architecture 13.2]

#### UX/Design System Requirements

- 採用 **Reflective Dawn** 主題：深色背景 (Zinc-950) + 琥珀金強調色 [Design System Part 2]
- 標題使用 Serif 字型 (Newsreader)，UI 使用 Sans-serif (Inter) [Design System Part 2.2]
- 所有可互動元件須有 Hover 狀態變化 [Design System Part 1.2]
- 點擊須有 `scale-95` 或 `brightness-90` 微反饋 [Design System Part 1.2]
- 轉場動畫統一 150ms - 200ms ease-out [Design System Part 1.3]
- Sidebar Active Item 須有金色光條指示器 [Design System Part 2.3]
- 支援深色/淺色主題切換 [UXUI 3.8.2]
- 響應式設計：Sidebar 在小螢幕須可收折 [UXUI 3.0]

### FR Coverage Map

| FR | Epic | 說明 |
|----|------|------|
| FR1 | Epic 7 | OAuth 登入 (Google/GitHub) |
| FR2 | Epic 2 | 快速捕捉視窗 (Cmd+Q) |
| FR3 | Epic 4 | 智慧解析邏輯 |
| FR4 | Epic 2 | Inbox 列表與分流 |
| FR5 | Epic 4 | 資源狀態轉換 |
| FR6 | Epic 4 | 資源編輯頁 |
| FR7 | Epic 3 | 專案 CRUD |
| FR8 | Epic 3 | 任務清單管理 |
| FR9 | Epic 3 | 專案進度計算 |
| FR10 | Epic 3 | Workbench 視圖 |
| FR11 | Epic 3 | 任務拖曳排序 |
| FR12 | Epic 4 | 領域 CRUD |
| FR13 | Epic 4 | 領域詳情頁 |
| FR14 | Epic 4 | 習慣管理 |
| FR15 | Epic 4 | 習慣頻率設定 |
| FR16 | Epic 4 | 資源庫篩選 |
| FR17 | Epic 5 | 指標類型定義 |
| FR18 | Epic 5 | 睡眠追蹤模組 |
| FR19 | Epic 5 | 日記習慣/指標填寫 |
| FR20 | Epic 5 | 資源足跡顯示 |
| FR21 | Epic 5 | 日記日期導航 |
| FR22 | Epic 2 | Dashboard 統計卡片 |
| FR23 | Epic 2 | 習慣熱力圖 |
| FR24 | Epic 2 | 指標趨勢圖表 |
| FR25 | Epic 5 | Settings 頁面 |
| FR26 | Epic 1 | Command Palette |
| FR27 | Epic 1 | Sidebar 收折 |

---

## Epic List

### Epic 1: 基礎架構與全站導航
**使用者成果**: 使用者可以看到完整的應用程式外殼，包含可收折的側邊欄、頂部工具列、主題切換與全域搜尋 UI。

**涵蓋需求**: FR26, FR27 + 設計系統需求

**包含範圍**:
- 完成 Sidebar 收折動畫與響應式行為
- TopBar 加入 Theme Toggle
- 建立 React Router 路由系統
- 建立所有頁面的空殼 (Placeholder Pages)
- Command Palette UI (Global Search)

---

### Epic 2: 儀表板與收件匣
**使用者成果**: 使用者可以在儀表板看到系統概覽，並透過快速捕捉視窗記錄想法到收件匣。

**涵蓋需求**: FR2, FR4, FR22, FR23, FR24

**包含範圍**:
- Dashboard 頁面 (含 Mock 統計卡片與圖表)
- Inbox 列表頁 (含 Mock 資源列表)
- Quick Capture Modal (Cmd+Q 快捷鍵)
- 習慣熱力圖與連續天數顯示

---

### Epic 3: 專案管理
**使用者成果**: 使用者可以建立專案、管理任務清單、在 Workbench 追蹤焦點任務。

**涵蓋需求**: FR7, FR8, FR9, FR10, FR11

**包含範圍**:
- Project List 頁面 (含 Workbench Doing/Todo)
- Project Detail 頁面 (Kanban + List 視圖)
- 任務拖曳排序 (dnd-kit)
- 專案進度自動計算

---

### Epic 4: 領域、習慣與資源庫
**使用者成果**: 使用者可以管理人生領域、建立習慣承諾，並在資源庫中查詢已處理的資源。

**涵蓋需求**: FR3, FR5, FR6, FR12, FR13, FR14, FR15, FR16

**包含範圍**:
- Area List 頁面 (Grid 視圖)
- Area Detail 頁面 (習慣管理器)
- Resource Library 頁面 (篩選器)
- Resource Editor 頁面 (分流工具 + 標籤管理)
- 智慧解析邏輯 (純 URL vs 混合內容)

---

### Epic 5: 日記與指標追蹤
**使用者成果**: 使用者可以在每日日記中記錄習慣打卡、填寫指標數據，並撰寫每日筆記。

**涵蓋需求**: FR17, FR18, FR19, FR20, FR21, FR25

**包含範圍**:
- Journal 頁面 (日期導航)
- TipTap 富文本編輯器整合
- Metrics List 頁面 (CRUD)
- Settings 頁面 (外觀、快捷鍵、帳號)
- 習慣勾選與指標填寫元件
- 睡眠追蹤模組

---

### Epic 6: 資料庫整合
**使用者成果**: 使用者的資料可以持久化儲存，重新整理頁面後資料不會消失。

**涵蓋需求**: NFR2, NFR10, NFR11, NFR12

**包含範圍**:
- RxDB Schema 定義 (所有實體)
- RxDB 初始化與加密設定
- Service Layer 實作 (全部 Services)
- 將 Mock Data 替換為 RxDB Hooks

---

### Epic 7: 身分驗證與同步
**使用者成果**: 使用者可以透過 Google/GitHub 登入，資料自動在多裝置間同步。

**涵蓋需求**: FR1, NFR3, NFR4, NFR13, NFR14

**包含範圍**:
- Login 頁面 (OAuth UI)
- FastAPI 後端服務 (Auth + Provisioning)
- CouchDB 設定 (Docker)
- RxDB Replication 同步
- 內容解析 API (/parse-url)

---

### Epic 8: 測試與安全性強化
**使用者成果**: 系統經過完整測試，資料安全有保障。

**涵蓋需求**: NFR5, NFR6, NFR7, NFR8, NFR9

**包含範圍**:
- Vitest 單元測試設定
- Playwright E2E 測試
- CouchDB Security Object 稽核
- IndexedDB 加密驗證
- OWASP 安全檢查

---

## Epic 1: 基礎架構與全站導航

**目標**: 使用者可以看到完整的應用程式外殼，包含可收折的側邊欄、頂部工具列、主題切換與全域搜尋 UI。

### Story 1.1: 完成 Sidebar 收折與響應式行為

As a **使用者**,
I want **Sidebar 可以順暢地收折與展開，並在不同螢幕尺寸下有適當的響應式行為**,
So that **我可以根據需求調整工作區域大小，在小螢幕上也能有良好的操作體驗**.

**Acceptance Criteria:**

**Given** 使用者在桌面裝置上檢視應用程式
**When** 使用者點擊 Sidebar 的收折按鈕
**Then** Sidebar 應以 300ms ease-in-out 動畫從 256px 收折至 64px
**And** 導航項目應只顯示圖示，文字隱藏
**And** Logo 區域應從文字「Kernel」變為單字母「K」
**And** 滑鼠懸停於圖示時應顯示 Tooltip 提示

**Given** 使用者在小螢幕裝置上 (< 768px)
**When** 應用程式載入
**Then** Sidebar 應預設為收折狀態
**And** 應提供漢堡選單按鈕控制 Sidebar 顯示/隱藏

**Given** Sidebar 處於展開狀態
**When** 使用者點擊 Recent 標題
**Then** Recent 項目清單應可展開/收合

---

### Story 1.2: TopBar Theme Toggle 主題切換

As a **使用者**,
I want **在 TopBar 上有主題切換按鈕，可以在深色與淺色模式間切換**,
So that **我可以根據環境光線或個人偏好選擇舒適的介面主題**.

**Acceptance Criteria:**

**Given** 使用者在任何頁面檢視 TopBar
**When** TopBar 載入
**Then** 應在右側顯示主題切換按鈕 (太陽/月亮圖示)
**And** 按鈕應反映當前主題狀態

**Given** 使用者處於深色模式 (Reflective Dawn)
**When** 使用者點擊主題切換按鈕
**Then** 介面應即時切換至淺色模式
**And** 主題偏好應儲存至 localStorage
**And** 下次訪問時應自動套用儲存的主題

**Given** 系統偵測到使用者的系統主題偏好
**When** 使用者首次訪問且無儲存偏好
**Then** 應自動套用系統偏好的主題

---

### Story 1.3: React Router 路由系統

As a **使用者**,
I want **應用程式有完整的路由系統，讓我可以透過 URL 直接訪問各個頁面**,
So that **我可以使用瀏覽器的上一頁/下一頁、書籤功能，並能分享特定頁面連結**.

**Acceptance Criteria:**

**Given** 使用者在瀏覽器輸入應用程式 URL
**When** 訪問根路徑 `/`
**Then** 應重導向至 `/inbox` (預設首頁)

**Given** 路由系統已設定
**When** 使用者點擊 Sidebar 導航項目
**Then** URL 應更新為對應路徑
**And** 頁面內容應切換而不重新載入整個應用程式

**Given** 以下路由已定義
**Then** 各路由應對應正確頁面：
- `/inbox` → InboxPage
- `/projects` → ProjectListPage
- `/projects/:id` → ProjectDetailPage
- `/areas` → AreaListPage
- `/areas/:id` → AreaDetailPage
- `/resources` → ResourceLibraryPage
- `/resources/:id` → ResourceEditorPage
- `/journal` → JournalPage
- `/journal/:date` → JournalPage (指定日期)
- `/metrics` → MetricsPage
- `/settings` → SettingsPage
- `/login` → LoginPage

**Given** 使用者訪問不存在的路由
**When** URL 不匹配任何定義的路由
**Then** 應顯示 404 頁面或重導向至首頁

---

### Story 1.4: 頁面空殼與 AppLayout 整合

As a **使用者**,
I want **所有頁面有一致的佈局結構，包含 Sidebar 和 TopBar**,
So that **我在不同頁面間導航時有一致的操作體驗**.

**Acceptance Criteria:**

**Given** 使用者已登入並訪問任何受保護頁面
**When** 頁面載入
**Then** 應顯示完整的 AppLayout：
- 左側：Sidebar (可收折)
- 頂部：TopBar (含 Breadcrumb、搜尋框、主題切換)
- 中央：MainContent 區域

**Given** 各頁面空殼已建立
**When** 使用者訪問各頁面
**Then** 應顯示頁面標題與基本結構：
- InboxPage：標題「Inbox」+ Empty State
- ProjectListPage：標題「Projects」+ Empty State
- AreaListPage：標題「Areas」+ Empty State
- ResourceLibraryPage：標題「Resources」+ Empty State
- JournalPage：標題「Journal」+ 日期顯示
- MetricsPage：標題「Metrics」+ Empty State
- SettingsPage：標題「Settings」+ Tabs 結構
- DashboardPage：標題「Dashboard」+ 卡片佈局區域

**Given** TopBar 存在 Breadcrumb 區域
**When** 使用者切換頁面
**Then** Breadcrumb 應更新顯示當前頁面名稱

---

### Story 1.5: Command Palette 全域搜尋 UI

As a **使用者**,
I want **透過快捷鍵 Cmd+K 開啟全域搜尋面板，快速查找資源、專案、領域**,
So that **我可以快速導航至任何內容，不需要手動瀏覽選單**.

**Acceptance Criteria:**

**Given** 使用者在應用程式任何頁面
**When** 使用者按下 `Cmd+K` (Mac) 或 `Ctrl+K` (Windows)
**Then** 應彈出 Command Palette Modal
**And** Modal 應包含搜尋輸入框
**And** 輸入框應自動獲得焦點

**Given** Command Palette 已開啟
**When** Modal 顯示且尚未輸入任何文字
**Then** 應顯示「近期開啟的項目」清單 (Mock Data，最多 10 項)
**And** 清單項目應顯示類型圖示、標題

**Given** Command Palette 已開啟
**When** 使用者輸入搜尋文字
**Then** 清單應即時過濾顯示匹配的項目 (Mock 搜尋)
**And** 應支援鍵盤上下鍵選擇項目
**And** 按 Enter 應導航至選中項目

**Given** Command Palette 已開啟
**When** 使用者按下 `Esc` 或點擊 Modal 外部
**Then** Command Palette 應關閉

**Given** 使用者點擊 TopBar 的搜尋框
**When** 搜尋框被點擊
**Then** 應開啟 Command Palette (與快捷鍵行為一致)

---

## Epic 2: 儀表板與收件匣

**目標**: 使用者可以在儀表板看到系統概覽，並透過快速捕捉視窗記錄想法到收件匣。

### Story 2.1: Dashboard 統計卡片與系統概覽

As a **使用者**,
I want **在儀表板上看到系統運行狀況的關鍵數據**,
So that **我可以快速了解目前的待辦狀況與系統使用情形**.

**Acceptance Criteria:**

**Given** 使用者訪問 Dashboard 頁面
**When** 頁面載入完成
**Then** 應顯示 4 張統計卡片 (Stat Cards)：
- **腦同步天數 (Brain-Sync Days)**: 顯示寫過日記的總天數 (Mock: 42)
- **Inbox 未處理數**: 顯示 Pending Resources 數量 (Mock: 5)
- **進行中專案 (Active Projects)**: 顯示 Active 狀態的專案數 (Mock: 3)
- **待辦任務 (Total Tasks)**: 顯示未完成任務總量 (Mock: 12)

**Given** Dashboard 頁面已載入
**When** 使用者檢視統計卡片
**Then** 每張卡片應包含：
- 數據標題
- 主要數值 (大字顯示)
- 適當的圖示

**Given** 統計卡片使用 Mock Data
**When** 資料來源為靜態模擬數據
**Then** 應於卡片元件中預留 data props 介面，便於後續替換為真實數據

---

### Story 2.2: 習慣熱力圖與連續達成天數

As a **使用者**,
I want **看到習慣達成的熱力圖與連續天數統計**,
So that **我可以追蹤自己的行為模式並保持動力**.

**Acceptance Criteria:**

**Given** 使用者在 Dashboard 檢視習慣追蹤區塊
**When** 區塊載入完成
**Then** 應顯示行為熱力圖 (Activity Heatmap)：
- 橫軸為日期 (最近 30 天)
- 縱軸為行為項目 (寫日記 + 各項習慣)
- 每格顏色深淺代表達成狀態

**Given** 熱力圖已渲染
**When** 使用者檢視習慣列表
**Then** 每個習慣名稱旁應顯示連續達成天數 (Current Streak)
**And** 格式為 `🔥 N days` (Mock Data)

**Given** 使用者將滑鼠懸停於熱力圖某一格
**When** 觸發 Hover 事件
**Then** 應顯示 Tooltip，包含：
- 具體日期
- 行為名稱
- 達成狀態 (是/否)

**Given** 熱力圖使用 recharts 套件實作
**When** 組件渲染
**Then** 應支援響應式寬度調整

---

### Story 2.3: 指標趨勢圖表

As a **使用者**,
I want **看到各項指標的歷史趨勢圖表**,
So that **我可以了解自己的狀態變化並發現模式**.

**Acceptance Criteria:**

**Given** 使用者在 Dashboard 檢視指標視覺化區塊
**When** 區塊載入完成
**Then** 應顯示至少一張趨勢圖表 (使用 recharts)：
- Number 類型指標：折線圖 (Line Chart)
- Rating 類型指標：區域圖 (Area Chart)
- Time 類型指標：散點圖 (Dot Plot)

**Given** 圖表區塊頂部
**When** 使用者檢視時間範圍選擇器
**Then** 應提供切換按鈕：7D / 30D / 90D / 1Y
**And** 預設選中 30D

**Given** 使用者點擊不同時間範圍按鈕
**When** 切換時間範圍
**Then** 圖表應即時更新顯示對應區間的 Mock Data

**Given** 使用者將滑鼠懸停於圖表資料點
**When** 觸發 Hover 事件
**Then** 應顯示 Tooltip，包含：
- 具體日期
- 指標名稱
- 數值

**Given** 圖表使用 Mock Data
**When** 資料為靜態模擬
**Then** 應預留 data props 介面，便於後續替換為 RxDB 查詢結果

---

### Story 2.4: Inbox 列表頁

As a **使用者**,
I want **在 Inbox 頁面看到所有待處理的資源列表**,
So that **我可以檢視並決定如何處理這些資訊**.

**Acceptance Criteria:**

**Given** 使用者訪問 Inbox 頁面 (`/inbox`)
**When** 頁面載入完成
**Then** 應顯示頁面標題 "Inbox" 與資源計數器 (e.g., "Inbox (3)")

**Given** Inbox 有待處理資源 (Mock Data)
**When** 列表渲染完成
**Then** 每筆資源應顯示：
- 類型圖示 (筆記 Note 圖示)
- 標題 (Title)
- 摘要 (前 50 字預覽)
- 時間戳記 (e.g., "2h ago")

**Given** 使用者將滑鼠懸停於列表項目
**When** 觸發 Hover 事件
**Then** 應顯示快速操作按鈕 (Hover Actions)：
- `Link to Project/Area` 按鈕
- `Archive` 按鈕
- `Delete` 按鈕

**Given** 使用者點擊 `Link to Project/Area` 按鈕
**When** 按鈕被點擊
**Then** 應彈出 Command Palette 形式的下拉選單 (UI 骨架，功能待 Epic 6 整合)

**Given** Inbox 沒有任何待處理資源
**When** 列表為空
**Then** 應顯示 Empty State：
- "Inbox Zero" 插圖或圖示
- 激勵文字 (e.g., "All clear! Great job.")

**Given** 使用者點擊列表項目
**When** 項目被點擊
**Then** 應導航至 Resource Editor 頁面 (`/resources/:id`)

---

### Story 2.5: Quick Capture Modal

As a **使用者**,
I want **透過快捷鍵 Cmd+Q 開啟快速捕捉視窗，隨時記錄想法**,
So that **我可以不中斷當前工作流，快速保留靈感或資訊**.

**Acceptance Criteria:**

**Given** 使用者在應用程式任何頁面
**When** 使用者按下 `Cmd+Q` (Mac) 或 `Ctrl+Q` (Windows)
**Then** 應彈出 Quick Capture Modal
**And** Modal 應置中顯示於畫面

**Given** Quick Capture Modal 已開啟
**When** Modal 渲染完成
**Then** 應包含：
- 多行文字輸入框 (自動獲得焦點)
- 簡易工具列 (預留 UI 位置)
- 背景應有半透明遮罩

**Given** 使用者在輸入框中輸入內容
**When** 按下 `Cmd+Enter` (Mac) 或 `Ctrl+Enter` (Windows)
**Then** Modal 應關閉
**And** 應顯示「已儲存至 Inbox」的 Toast 通知 (Mock 行為，實際儲存待 Epic 6)

**Given** Quick Capture Modal 已開啟
**When** 使用者按下 `Esc` 鍵
**Then** Modal 應關閉且不儲存

**Given** Quick Capture Modal 已開啟
**When** 使用者點擊 Modal 外部遮罩
**Then** Modal 應關閉且不儲存

**Given** 使用者點擊 Sidebar 的 "New Resource" 按鈕
**When** 按鈕被點擊
**Then** 應開啟 Quick Capture Modal (與快捷鍵行為一致)

---

## Epic 3: 專案管理

**目標**: 使用者可以建立專案、管理任務清單、在 Workbench 追蹤焦點任務。

### Story 3.1: Project List 頁面與 Workbench 區塊

As a **使用者**,
I want **在專案列表頁看到 Workbench 工作台，聚合顯示跨專案的待辦任務**,
So that **我可以專注於「今天該做什麼」，而不需要逐一檢視各專案**.

**Acceptance Criteria:**

**Given** 使用者訪問 Projects 頁面 (`/projects`)
**When** 頁面載入完成
**Then** 頁面應分為上下兩部分：
- 上半部：Workbench 工作台
- 下半部：專案列表 (Project List)

**Given** Workbench 區塊已渲染
**When** 使用者檢視工作台
**Then** 應顯示左右兩欄：
- **左側 (Doing)**: 標題「正在處理」，顯示焦點任務 (Mock: 2 筆)
- **右側 (Todo)**: 標題「待辦事項」，顯示所有 Active 專案的未完成任務聚合 (Mock: 8 筆)

**Given** Workbench 顯示任務列表
**When** 任務項目渲染
**Then** 每筆任務應顯示：
- 勾選框 (Checkbox)
- 任務名稱
- 所屬專案名稱 (小字標籤)

**Given** Workbench 與 Project List 之間
**When** 使用者檢視分界線
**Then** 應提供可拖曳的分隔線 (Resizer)，允許調整兩區域高度比例

---

### Story 3.2: 專案卡片與狀態篩選

As a **使用者**,
I want **以卡片形式檢視所有專案，並可依狀態篩選**,
So that **我可以快速掌握專案全貌並找到目標專案**.

**Acceptance Criteria:**

**Given** 使用者在 Projects 頁面檢視專案列表區
**When** 列表區渲染完成
**Then** 應顯示：
- 頁面標題 "Projects"
- 新增專案按鈕 `[+ New Project]`
- 狀態篩選按鈕組 (Active / Completed / Archived)
- 專案卡片網格 (Grid Layout)

**Given** 專案卡片已渲染 (Mock Data: 4 個專案)
**When** 使用者檢視單一卡片
**Then** 卡片應包含：
- 狀態標籤 (Status Tag)：不同顏色區分 Active/Completed/Archived
- 專案名稱 (Project Name)
- 進度條：顯示 `x / y 任務完成` + 百分比進度條

**Given** 使用者點擊狀態篩選按鈕
**When** 選擇特定狀態 (e.g., Completed)
**Then** 專案卡片應即時過濾，僅顯示該狀態的專案

**Given** 使用者點擊 `[+ New Project]` 按鈕
**When** 按鈕被點擊
**Then** 應彈出 Create Project Modal，包含：
- Project Name 輸入框 (必填)
- Related Area 選擇器 (選填，Mock 選項)
- Due Date 日期選擇器 (選填)
- 確認與取消按鈕

**Given** 使用者在 Modal 填寫專案名稱並點擊確認
**When** 表單提交
**Then** Modal 應關閉
**And** 應顯示 Toast：「專案已建立」(Mock 行為)
**And** 應導航至新專案的詳情頁 (`/projects/:newId`)

**Given** 使用者點擊專案卡片
**When** 卡片被點擊
**Then** 應導航至該專案詳情頁 (`/projects/:id`)

---

### Story 3.3: Project Detail 頁面佈局

As a **使用者**,
I want **在專案詳情頁看到完整的專案資訊與任務管理區域**,
So that **我可以深入管理單一專案的執行狀況**.

**Acceptance Criteria:**

**Given** 使用者訪問專案詳情頁 (`/projects/:id`)
**When** 頁面載入完成
**Then** 應顯示兩欄式佈局：
- 主內容區 (70%)
- 右側資訊欄 (30%)

**Given** 主內容區已渲染
**When** 使用者檢視內容
**Then** 應包含：
- **頁頭**: 專案名稱 (可 Inline Edit) + Delete 按鈕
- **專案進度**: `x / y 任務完成` + 進度條
- **專案摘要**: Markdown 文字區塊 (Textarea，支援編輯)
- **任務清單區**: TaskList 元件容器

**Given** 右側資訊欄已渲染
**When** 使用者檢視側欄
**Then** 應包含：
- **狀態 (Status)**: Badge 顯示 (Active/Completed/Archived)
- **截止日期 (Due Date)**: 日期顯示或「未設定」
- **所屬領域 (Area)**: 顯示關聯 Area 或「無」
- **關聯資源 (Linked Resources)**: 資源連結列表 (Mock: 2 筆)
- **Archive 按鈕**: 封存專案
- **Delete 按鈕**: 刪除專案 (需二次確認)

**Given** 使用者點擊專案名稱
**When** 進入編輯模式
**Then** 應可直接修改專案名稱 (Inline Edit)
**And** 按 Enter 或點擊外部時儲存 (Mock 行為)

**Given** 使用者點擊 Delete 按鈕
**When** 按鈕被點擊
**Then** 應彈出確認對話框：「確定要刪除此專案？此操作無法復原。」
**And** 確認後導航回專案列表頁

---

### Story 3.4: 任務清單與進度計算

As a **使用者**,
I want **在專案中建立多個任務清單，並勾選完成任務**,
So that **我可以有組織地拆解專案工作，並追蹤完成進度**.

**Acceptance Criteria:**

**Given** 使用者在專案詳情頁的任務清單區
**When** 區域渲染完成
**Then** 應顯示多個 TaskList 群組 (Mock: 2 個清單)
**And** 每個 TaskList 包含：
- 清單標題 (可編輯)
- 任務項目列表
- 「+ Add Task」按鈕

**Given** 單一 TaskList 已渲染
**When** 使用者檢視任務項目
**Then** 每筆任務應顯示：
- 勾選框 (Checkbox)
- 任務名稱
- Hover 時顯示 Edit 與 Delete 按鈕

**Given** 使用者勾選任務的 Checkbox
**When** 任務被標記為完成
**Then** 任務文字應加上刪除線樣式
**And** 頁頭進度條應即時更新 (重新計算百分比)

**Given** 使用者點擊「+ Add Task」按鈕
**When** 按鈕被點擊
**Then** 應在清單底部新增一列空白輸入框
**And** 輸入框自動獲得焦點
**And** 按 Enter 儲存新任務並新增下一列
**And** 按 Esc 取消新增

**Given** 使用者點擊 TaskList 標題旁的選單
**When** 選單開啟
**Then** 應提供選項：
- Rename：重命名清單
- Delete List：刪除清單及所有任務 (需確認)

**Given** 專案有 10 個任務，其中 6 個已完成
**When** 進度計算
**Then** 進度條應顯示 60% 且文字為「6 / 10 任務完成」

---

### Story 3.5: 任務拖曳排序 (dnd-kit)

As a **使用者**,
I want **透過拖曳方式調整任務順序，並將任務在 Doing/Todo 之間移動**,
So that **我可以靈活地安排工作優先級與焦點任務**.

**Acceptance Criteria:**

**Given** 使用者在 Workbench 的 Todo 區域
**When** 使用者拖曳一筆任務至 Doing 區域
**Then** 該任務應移動至 Doing 區域
**And** 拖曳過程應有視覺反饋 (拖曳預覽、放置區高亮)
**And** 動畫過渡應流暢 (150-200ms)

**Given** 使用者在 Project Detail 的 TaskList 中
**When** 使用者拖曳任務調整順序
**Then** 任務應在同一清單內重新排序
**And** 排序變更應即時反映 (Mock State)

**Given** 使用者在 Workbench 的 Doing 區域
**When** 使用者拖曳任務回 Todo 區域
**Then** 該任務應移回 Todo 區域

**Given** 使用者拖曳任務時
**When** 拖曳進行中
**Then** 應顯示拖曳手把圖示 (drag handle)
**And** 被拖曳項目應有半透明效果
**And** 放置目標區域應有高亮邊框

**Given** dnd-kit 套件已安裝
**When** 拖曳功能實作
**Then** 應使用 `@dnd-kit/core` 與 `@dnd-kit/sortable`
**And** 應支援鍵盤操作 (Accessibility)

---

## Epic 4: 領域、習慣與資源庫

**目標**: 使用者可以管理人生領域、建立習慣承諾，並在資源庫中查詢已處理的資源。

### Story 4.1: Area List 頁面 (Grid 視圖)

As a **使用者**,
I want **以視覺化的卡片網格檢視所有領域**,
So that **我可以看到人生版圖的全貌，並快速進入感興趣的領域**.

**Acceptance Criteria:**

**Given** 使用者訪問 Areas 頁面 (`/areas`)
**When** 頁面載入完成
**Then** 應顯示網格視圖 (Grid Layout) 的領域卡片

**Given** 領域卡片已渲染 (Mock Data: 4 個領域)
**When** 使用者檢視單一卡片
**Then** 卡片應包含：
- **上半部**: 滿版封面圖 (Cover Image)
- **下半部**: 領域名稱、狀態燈號 (Active/Hidden)、關鍵統計 (Active Projects 數 / Habits 數)

**Given** 領域列表末端
**When** 列表渲染完成
**Then** 應顯示 `[+ New Area]` 卡片作為新增入口

**Given** 使用者點擊 `[+ New Area]` 卡片
**When** 卡片被點擊
**Then** 應彈出 Create Area Modal，包含：
- Name 輸入框 (必填)
- 預設封面圖選擇器 (選填)
- 確認與取消按鈕

**Given** 使用者點擊領域卡片
**When** 卡片被點擊
**Then** 應導航至該領域詳情頁 (`/areas/:id`)

---

### Story 4.2: Area Detail 頁面佈局

As a **使用者**,
I want **在領域詳情頁看到完整的領域資訊、關聯專案與習慣管理區**,
So that **我可以全面維護這個人生責任範圍**.

**Acceptance Criteria:**

**Given** 使用者訪問領域詳情頁 (`/areas/:id`)
**When** 頁面載入完成
**Then** 應顯示：
- **頁頭 (Header)**: 滿版背景圖 + 領域標題 (可 Inline Edit) + 核心統計
- **兩欄式佈局**: 主內容區 (左) + 側欄 (右)

**Given** 頁頭區已渲染
**When** 使用者檢視統計數據
**Then** 應顯示：
- Active Projects 數量
- Active Habits 數量

**Given** 主內容區已渲染
**When** 使用者檢視內容
**Then** 應包含：
- **習慣管理區 (Habit Manager)**: 習慣清單與操作
- **進行中專案 (Active Projects)**: 精簡版專案卡片列表

**Given** 右側側欄已渲染
**When** 使用者檢視側欄
**Then** 應包含：
- **領域描述 (Description)**: 可編輯的 Textarea
- **關聯資源 (Linked Resources)**: 資源連結列表 (Mock: 3 筆)
- **Hidden Toggle**: 隱藏領域開關
- **Delete Area 按鈕**: 紅色刪除按鈕 (需二次確認)

**Given** 使用者點擊 Header 封面圖
**When** 圖片區域被點擊
**Then** 應彈出圖片更換介面 (Mock UI)

**Given** 使用者點擊領域標題
**When** 標題被點擊
**Then** 應進入 Inline Edit 模式

---

### Story 4.3: 習慣管理器 (Habit Manager)

As a **使用者**,
I want **在領域內建立與管理習慣，設定頻率並控制啟用狀態**,
So that **我可以定義需要長期維持的行為承諾**.

**Acceptance Criteria:**

**Given** 使用者在 Area Detail 的習慣管理區
**When** 區域渲染完成
**Then** 應顯示習慣清單 (Mock: 3 個習慣)
**And** 每列習慣應包含：
- 頻率標籤 (Tag 樣式): `[Daily]` 或 `[Weekly - Mon]`
- 習慣名稱
- 啟用/暫停開關 (Toggle)
- Edit 按鈕
- Delete 按鈕

**Given** 習慣頻率為 Daily
**When** 清單渲染
**Then** 標籤應顯示 `[Daily]`

**Given** 習慣頻率為 Weekly 且指定星期一
**When** 清單渲染
**Then** 標籤應顯示 `[Weekly - Mon]`

**Given** 使用者點擊「+ Add Habit」按鈕
**When** 按鈕被點擊
**Then** 應彈出 Create Habit Modal，包含：
- Habit Name 輸入框 (必填)
- Frequency 選擇器：Daily / Weekly
- 若選擇 Weekly，顯示星期選擇器 (Mon-Sun)
- 確認與取消按鈕

**Given** 使用者切換習慣的啟用開關
**When** Toggle 狀態改變
**Then** 習慣狀態應即時更新 (Active ↔ Paused)
**And** Paused 狀態的習慣應以淡化樣式顯示

**Given** 使用者點擊習慣的 Delete 按鈕
**When** 按鈕被點擊
**Then** 應彈出確認對話框：「刪除習慣將移除所有相關紀錄，確定要刪除嗎？」

---

### Story 4.4: Resource Library 頁面與篩選器

As a **使用者**,
I want **在資源庫中搜尋與篩選已處理的資源**,
So that **我可以快速找到需要的參考資料**.

**Acceptance Criteria:**

**Given** 使用者訪問 Resources 頁面 (`/resources`)
**When** 頁面載入完成
**Then** 應顯示：
- 頁面標題 "Resources"
- Filter Bar 篩選列
- 資源列表 (List View)

**Given** Filter Bar 已渲染
**When** 使用者檢視篩選選項
**Then** 應包含：
- **狀態篩選**: 下拉選單 (Processed / Archived / All)，預設 Processed
- **Project 篩選**: 下拉選單 (Mock 專案列表)
- **Area 篩選**: 下拉選單 (Mock 領域列表)
- **Tag 篩選**: 標籤多選器

**Given** 資源列表已渲染 (Mock Data: 6 筆資源)
**When** 使用者檢視列表項目
**Then** 每筆資源應顯示：
- 類型圖示 (Note 圖示)
- 標題 (Title)
- 摘要預覽 (前 50 字)
- Source Link 指示器 (若有 sourceLink，顯示外部連結圖示)
- 關聯標記 (Context Badges): Project/Area 標籤
- Tags 列表

**Given** 使用者選擇篩選條件
**When** 篩選器值改變
**Then** 資源列表應即時過濾顯示匹配項目 (Mock 過濾)

**Given** 資源狀態為 Archived
**When** 該資源顯示於列表
**Then** 應以淡化樣式顯示並加註「Archived」標記

**Given** 使用者點擊資源列表項目
**When** 項目被點擊
**Then** 應導航至資源編輯頁 (`/resources/:id`)

---

### Story 4.5: Resource Editor 頁面

As a **使用者**,
I want **在資源編輯頁檢視與編輯資源的完整內容**,
So that **我可以深度整理與分類這筆資訊**.

**Acceptance Criteria:**

**Given** 使用者訪問資源編輯頁 (`/resources/:id`)
**When** 頁面載入完成
**Then** 應顯示：
- 主內容欄 (左側 70%)
- 屬性側欄 (右側 30%)

**Given** 主內容欄已渲染
**When** 使用者檢視內容
**Then** 應包含：
- **標題輸入框**: 可編輯的大字標題
- **內容編輯區**: Textarea (TipTap 整合預留位置)
- **OpenGraph 預覽卡片**: 若資源有 sourceLink，顯示預覽 (Mock UI)

**Given** 屬性側欄已渲染
**When** 使用者檢視側欄
**Then** 應包含：
- **已分流目標**: 顯示 linkedProjects 與 linkedAreas 列表
- **分流工具 (Dispatch Tool)**: 「+ Link」按鈕
- **標籤 (Tags)**: Tag Input 元件
- **參考連結 (Source Link)**: URL 顯示與外部連結按鈕
- **狀態**: Badge 顯示 (Pending/Processed/Archived)
- **Archive 按鈕** / **Restore 按鈕**
- **Delete 按鈕**

**Given** 使用者編輯標題或內容
**When** 內容變更
**Then** 應即時顯示「Saving...」指示 (Mock 自動儲存 UI)

**Given** 資源有 sourceLink
**When** 使用者點擊外部連結按鈕
**Then** 應在新分頁開啟該 URL

---

### Story 4.6: 資源分流與智慧解析 UI

As a **使用者**,
I want **透過分流工具將資源關聯至專案或領域，並預覽智慧解析結果**,
So that **我可以快速將資訊歸位至 PARA 系統**.

**Acceptance Criteria:**

**Given** 使用者在 Resource Editor 點擊「+ Link」按鈕
**When** 按鈕被點擊
**Then** 應彈出 Command Palette 形式的選單
**And** 選單應包含：
- 搜尋輸入框
- Projects 區段 (Mock 專案列表)
- Areas 區段 (Mock 領域列表)

**Given** Dispatch 選單已開啟
**When** 使用者輸入搜尋文字
**Then** 選項應即時過濾

**Given** Dispatch 選單已開啟
**When** 使用者選擇一個或多個 Project/Area
**Then** 選中項目應顯示勾選標記
**And** 支援多選 (Multi-select)

**Given** 使用者完成分流選擇並關閉選單
**When** 選單關閉
**Then** 側欄的「已分流目標」區域應更新顯示新關聯

**Given** 資源原為 Pending 狀態
**When** 使用者建立至少一個 Project 或 Area 關聯
**Then** 資源狀態應自動轉為 Processed
**And** 側欄狀態 Badge 應更新

**Given** 使用者在 Quick Capture 輸入純 URL (Mock)
**When** 內容解析
**Then** 應顯示智慧解析結果預覽 (UI 預留位置)：
- 解析狀態指示器
- 預覽：抓取的標題、Metadata

**Given** 使用者在 Quick Capture 輸入混合內容
**When** 內容包含多行文字
**Then** 第一行應自動設為標題
**And** 其餘內容存入 Content 區域

---

## Epic 5: 日記與指標追蹤

**目標**: 使用者可以在每日日記中記錄習慣打卡、填寫指標數據，並撰寫每日筆記。

### Story 5.1: Journal 頁面佈局與日期導航

As a **使用者**,
I want **在日記頁面快速切換日期，檢視不同日期的紀錄**,
So that **我可以回顧過去的狀態或補填遺漏的資料**.

**Acceptance Criteria:**

**Given** 使用者訪問 Journal 頁面 (`/journal`)
**When** 頁面載入完成
**Then** 應顯示今日日期的日記
**And** URL 應更新為 `/journal/YYYY-MM-DD` 格式

**Given** Journal 頁面已渲染
**When** 使用者檢視佈局
**Then** 應顯示：
- **頂部**: 日期顯示 + 日期導航器
- **左側 (60%)**: 結構化紀錄區 (Daily Note + Resource Footprints)
- **右側 (40%)**: 狀態與行動區 (Habits + Metrics + Action Guide)

**Given** 日期導航器已渲染
**When** 使用者檢視導航元件
**Then** 應包含：
- 當前日期顯示 (可點擊開啟日曆)
- `<` 前一天按鈕
- `Today` 按鈕
- `>` 後一天按鈕

**Given** 使用者點擊日期顯示區域
**When** 區域被點擊
**Then** 應彈出日曆選擇器 (Calendar Picker)
**And** 選擇日期後應導航至該日期

**Given** 使用者按下 `Ctrl + [` (或 `Cmd + [`)
**When** 快捷鍵觸發
**Then** 應導航至前一天

**Given** 使用者按下 `Ctrl + ]` (或 `Cmd + ]`)
**When** 快捷鍵觸發
**Then** 應導航至後一天

**Given** 使用者選擇未來日期
**When** 日期為今日之後
**Then** 應僅顯示專案與任務資訊 (唯讀)
**And** 習慣勾選與指標填寫應禁用

---

### Story 5.2: 習慣勾選與指標填寫元件

As a **使用者**,
I want **在日記中勾選今日習慣達成狀態，並填寫各項指標數據**,
So that **我可以追蹤自己的行為與狀態變化**.

**Acceptance Criteria:**

**Given** 使用者在 Journal 右側的習慣勾選區
**When** 區域渲染完成
**Then** 應顯示當日需執行的 Active 習慣清單 (Mock: 4 個)
**And** 每個習慣應包含：
- 勾選框 (Checkbox)
- 習慣名稱
- 頻率標籤 (Daily / Weekly)

**Given** 使用者勾選習慣 Checkbox
**When** Checkbox 狀態改變
**Then** 習慣應標記為已完成 (視覺反饋)
**And** 應產生 HabitLog 紀錄 (Mock State)

**Given** 使用者在 Journal 右側的指標填寫區
**When** 區域渲染完成
**Then** 應顯示已啟用的指標清單 (Mock: 3 個)
**And** 每個指標應根據類型顯示對應輸入元件

**Given** 指標類型為 Select
**When** 元件渲染
**Then** 應顯示 Tag Group (標籤按鈕組)
**And** 點擊標籤即選擇該選項

**Given** 指標類型為 Number
**When** 元件渲染
**Then** 應顯示數字輸入框 + 單位標籤

**Given** 指標類型為 Rating
**When** 元件渲染
**Then** 應顯示 1-10 評分滑桿 (Slider)

**Given** 指標類型為 Time
**When** 元件渲染
**Then** 應顯示時間選擇器 (Time Picker, HH:mm)

**Given** 使用者填寫指標數值
**When** 數值變更
**Then** 應產生 MetricEntry 紀錄 (Mock State)

---

### Story 5.3: 每日筆記與資源足跡

As a **使用者**,
I want **在日記中撰寫自由格式的每日筆記，並檢視當日的資源足跡**,
So that **我可以記錄想法並回顧當天接觸的資訊**.

**Acceptance Criteria:**

**Given** 使用者在 Journal 左側的每日筆記區
**When** 區域渲染完成
**Then** 應顯示 TipTap 富文本編輯器
**And** 編輯器應支援基本 Markdown 語法

**Given** TipTap 編輯器已渲染
**When** 使用者輸入文字
**Then** 應支援：
- 標題 (# Heading)
- 粗體/斜體
- 列表 (有序/無序)
- 引用區塊

**Given** 使用者編輯每日筆記
**When** 內容變更
**Then** 應即時自動儲存 (Mock State)
**And** 應顯示「已儲存」指示

**Given** 使用者在 Journal 左側的資源足跡區
**When** 區域渲染完成
**Then** 應顯示當日「建立」或「修改」的資源清單 (Mock: 3 筆)
**And** 每筆應包含：
- 類型圖示
- 資源標題
- 操作類型標籤 (Created / Modified)

**Given** 使用者點擊資源足跡項目
**When** 項目被點擊
**Then** 應滑出資源預覽窗格 (Sheet/Drawer)
**Or** 導航至資源編輯頁

---

### Story 5.4: Metrics 列表頁與指標定義

As a **使用者**,
I want **建立與管理自定義指標，設定類型與屬性**,
So that **我可以定義需要長期追蹤的量化數據**.

**Acceptance Criteria:**

**Given** 使用者訪問 Metrics 頁面 (`/metrics`)
**When** 頁面載入完成
**Then** 應顯示：
- 頁面標題 "Metrics"
- 「+ New Metric」按鈕
- 指標列表 (區分「啟用中」與「已停用」)

**Given** 指標列表已渲染 (Mock: 5 個指標)
**When** 使用者檢視列表
**Then** 每個指標卡片應包含：
- 指標名稱
- 類型標籤 (Select/Number/Rating/Time)
- 最後紀錄值 (Mock)
- 啟用/停用 Toggle
- Edit / Delete 按鈕

**Given** 系統預設睡眠追蹤指標
**When** 列表渲染
**Then** 應標示為「系統指標」(System Badge)
**And** 不可刪除，僅可啟用/停用

**Given** 使用者點擊「+ New Metric」按鈕
**When** 按鈕被點擊
**Then** 應彈出 Create Metric Modal，包含：
- Name 輸入框 (必填)
- Type 選擇器 (Select/Number/Rating/Time)
- 條件欄位：
  - Select: 選項清單輸入
  - Number: 單位輸入
  - Rating/Time: 無額外設定
- 確認與取消按鈕

**Given** 使用者拖曳指標項目
**When** 拖曳排序
**Then** 指標順序應更新
**And** 此順序影響日記中的顯示順序

**Given** 使用者點擊指標的 Delete 按鈕
**When** 按鈕被點擊
**Then** 應彈出警告對話框：「刪除指標將遺失所有歷史數據，確定要刪除嗎？」

---

### Story 5.5: 睡眠追蹤模組

As a **使用者**,
I want **在日記中記錄睡眠時間，並自動計算睡眠時數**,
So that **我可以追蹤睡眠品質與規律性**.

**Acceptance Criteria:**

**Given** 使用者在 Journal 的指標區檢視睡眠模組
**When** 睡眠追蹤已啟用
**Then** 應顯示專屬的睡眠輸入元件：
- **入睡時間 (Sleep At)**: 時間選擇器 (記錄昨晚)
- **起床時間 (Wake Up At)**: 時間選擇器 (記錄今日)
- **睡眠時數**: 自動計算顯示

**Given** 使用者填寫入睡與起床時間
**When** 兩個時間都已填寫
**Then** 應自動計算並顯示睡眠時數
**And** 格式為 `X 小時 Y 分鐘`

**Given** 入睡時間為 23:30，起床時間為 07:00
**When** 系統計算
**Then** 應顯示「7 小時 30 分鐘」

**Given** 入睡時間為 01:00 (凌晨)，起床時間為 08:00
**When** 系統計算 (跨日)
**Then** 應正確計算為「7 小時 0 分鐘」

**Given** 睡眠追蹤在 Metrics 頁面被停用
**When** 使用者訪問 Journal
**Then** 睡眠輸入元件應不顯示

---

### Story 5.6: Settings 頁面

As a **使用者**,
I want **在設定頁面管理帳號資訊、外觀偏好與快捷鍵**,
So that **我可以自定義應用程式體驗**.

**Acceptance Criteria:**

**Given** 使用者訪問 Settings 頁面 (`/settings`)
**When** 頁面載入完成
**Then** 應顯示 Tabs 導航：
- General & Account
- Appearance
- Keyboard Shortcuts
- Billing & Subscription

**Given** 使用者在 General & Account Tab
**When** Tab 內容渲染
**Then** 應顯示：
- 登入方式 (Google/GitHub) + Email (唯讀)
- 顯示名稱 (Display Name) 輸入框 (可編輯)
- 頭像顯示 + 更換按鈕

**Given** 使用者在 Appearance Tab
**When** Tab 內容渲染
**Then** 應顯示：
- 主題切換：Kernel Dark / Kernel Light (Radio Group)
- 系統字型選擇：Inter / Roboto / Noto Sans TC (Select)

**Given** 使用者切換主題
**When** 選擇不同主題
**Then** 介面應即時套用新主題
**And** 偏好應儲存至 localStorage

**Given** 使用者在 Keyboard Shortcuts Tab
**When** Tab 內容渲染
**Then** 應顯示快捷鍵清單 (唯讀)：
- Quick Capture: `Ctrl/Cmd + Q`
- Global Search: `Ctrl/Cmd + K`
- Previous Day: `Ctrl/Cmd + [`
- Next Day: `Ctrl/Cmd + ]`

**Given** 使用者在 Billing & Subscription Tab
**When** Tab 內容渲染
**Then** 應顯示：
- 方案狀態 Badge (Free / Pro)
- Upgrade 按鈕 (Mock)
- 付款資訊區 (Mock 卡片資訊)
