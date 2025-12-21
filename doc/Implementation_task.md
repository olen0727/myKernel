# **Kernel 實作任務清單 (Implementation Tasks)**

本文件依據

PRD.md 中的 Roadmap 規劃，將開發流程拆解為可執行的細部任務。

**標記 `[🔍 驗證點]` 的項目代表需要您介入測試與確認的關鍵里程碑。**

---

## **Phase 1: 基礎建設與環境 (Foundation)**

**目標**：確保本地開發環境運作正常，技術棧基底建立完成。

- [ ]  **1.1 專案初始化 (Project Initialization)**
    - [ ]  使用 Vite 初始化 React + TypeScript 專案 (`npm create vite@latest`)。
    - [ ]  設定 `.editorconfig`, `.prettierrc`, `.eslintrc.cjs` 以統一程式碼風格。
    - [ ]  設定 `tsconfig.json` 的 Path Aliases (e.g. `@/components`, `@/lib`)。
    - [ ]  清理預設樣板檔案。
    - [ ]  **[🔍 驗證點] 確認專案可成功啟動 (`npm run dev`) 且無 Lint 錯誤。**
- [ ]  **1.2 設計系統建置 (Design System Setup)**
    - [ ]  安裝 TailwindCSS v3.4 並初始化設定 (`npx tailwindcss init -p`)。
    - [ ]  定義 CSS Variables 於 `index.css` (包含 `Reflective Dawn` 主題色票)。
    - [ ]  安裝與設定 `shadcn/ui` (`npx shadcn-ui@latest init`)。
    - [ ]  透過 `@fontsource` 安裝並設定字型 (Newsreader, Inter)。
    - [ ]  安裝基礎圖示庫 `lucide-react` 與動畫庫 `framer-motion`。
    - [ ]  安裝 `usehooks-ts`。
    - [ ]  **[🔍 驗證點] 檢查首頁字型是否正確載入 (Newsreader/Inter)，並測試 Tailwind 設定是否生效。**
- [ ]  **1.3 佈局實作 (Layout Implementation)**
    - [ ]  建立 `Sidebar` 組件 (支援折疊/展開動畫)。
    - [ ]  建立 `TopBar` 組件 (包含 Theme Toggle 與 User Avatar)。
    - [ ]  建立 `AppLayout` 整合 Sidebar 與 MainContent。
    - [ ]  設定 React Router DOM 並建立基礎路由介面 (Routes)。
    - [ ]  **[🔍 驗證點] 測試 Sidebar 收折動畫順暢度，確認 RWD 響應式行為 (TopBar 在小螢幕的表現)。**

---

## **Phase 2: 全站頁面實作 (All Pages Prototype)**

**目標**：在不串接真實資料庫的情況下，完成全站所有關鍵頁面的 UI/UX 互動。

- [ ]  **2.1 儀表板與收件匣 (Dashboard & Inbox)**
    - [ ]  安裝 `recharts` 並實作 Dashboard 模擬圖表 (Mock Data)。
    - [ ]  實作 `InboxPage` 列表視圖。
    - [ ]  實作 `QuickCaptureModal` (包含 UI 動畫)。
    - [ ]  **[🔍 驗證點] 測試 Quick Capture 彈窗的快捷鍵喚醒 (`Cmd+Q` / `Ctrl+Q`) 與關閉體驗。**
- [ ]  **2.2 專案管理 (Project Management)**
    - [ ]  安裝 `@dnd-kit/core` 相關套件。
    - [ ]  實作 `ProjectListPage` (含 Workbench Doing/Todo 區域)。
    - [ ]  實作 `ProjectDetailPage` (含 Task List 與 Kanban 切換)。
    - [ ]  實作 看板拖曳與任務排序功能 (純前端 Mock State)。
    - [ ]  **[🔍 驗證點] 實際操作 Kanban 拖曳任務，確認動畫流暢且無卡頓 (Drag & Drop UX)。**
- [ ]  **2.3 領域與資源 (Areas & Resources)**
    - [ ]  實作 `AreaListPage` (Grid View)。
    - [ ]  實作 `AreaDetailPage` (Header Cover + Habit List)。
    - [ ]  實作 `ResourceLibraryPage` (含篩選器 Filter Bar UI)。
    - [ ]  實作 `ResourceEditor` 頁面 (Layout 框架)。
    - [ ]  **[🔍 驗證點] 測試 Resource Library 篩選器介面互動 (Tag 多選、狀態切換) 是否直覺。**
- [ ]  **2.4 日記與編輯器 (Journal & Editor)**
    - [ ]  安裝 `@udecode/plate-common` 與相關插件。
    - [ ]  設定 Plate Editor 基礎組件 (Toolbar, Editor Area)。
    - [ ]  實作 `JournalPage` (日期導航器, 整合 Plate Editor)。
    - [ ]  **[🔍 驗證點] 在編輯器中輸入 Markdown (如 `# Heading`, `list`)，確認即時預覽與 Slash Command 功能正常。**

---

## **Phase 3: 資料庫整合與邏輯實作 (Backend Integration)**

**目標**：將靜態頁面轉化為動態應用 (Local-First Realization)。

- [ ]  **3.1 資料庫架構與實例 (RxDB Setup)**
    - [ ]  安裝 `rxdb`, `rxjs` 與 `dexie-encrypted`。
    - [ ]  定義 `Resource`, `Project`, `Task` Schema。
    - [ ]  定義 `Area`, `Journal`, `Metric` Schema。
    - [ ]  建立 RxDB 初始化程式碼 (含 Encryption Password 機制)。
    - [ ]  **[🔍 驗證點] 透過 Console 檢查 RxDB 是否成功初始化，並確認 Schema 驗證機制運作正常。**
- [ ]  **3.2 服務層實作 (Service Logic)**
    - [ ]  實作 `ResourceService` (Create, Update, Dispatch logic)。
    - [ ]  實作 `ProjectService` (Task Management, Progress Calculation)。
    - [ ]  實作 `JournalService` (Aggregation logic)。
    - [ ]  將 UI 組件的 Mock Data 替換為 `useRxQuery` Hooks。
    - [ ]  **[🔍 驗證點] 實際建立一筆 Resource 與 Project，確認資料能持久化儲存 (重整頁面後資料不消失)。**
- [ ]  **3.3 身分驗證與同步 (Auth & Sync)**
    - [ ]  撰寫 `docker-compose.yml` 啟動本地 CouchDB。
    - [ ]  實作 `LoginPage` UI (Google/GitHub 按鈕)。
    - [ ]  初始化 Python FastAPI 專案。
    - [ ]  實作 FastAPI: OAuth Callback 與 JWT 發放。
    - [ ]  實作 FastAPI: CouchDB Provisioning (User DB Creation)。
    - [ ]  前端實作: RxDB Replication Plugin 設定 (連接 CouchDB)。
    - [ ]  **[🔍 驗證點] 執行登入流程，確認後端自動建立了 `userdb-{uuid}`，且前端能成功同步資料至 CouchDB。**
- [ ]  **3.4 核心功能邏輯 (Feature Logic)**
    - [ ]  Python: 整合 `trafilatura` 與 `beautifulsoup4`。
    - [ ]  實作 API: `/parse-url` endpoint。
    - [ ]  前端: Quick Capture 整合 Parse URL API。
    - [ ]  **[🔍 驗證點] 在 Quick Capture 輸入外部文章連結，確認能抓取到標題並解析出內文 Markdown。**

---

## **Phase 4: 測試與安全性 (QA & Security)**

**目標**：確保系統穩定與資安合規。

- [ ]  **4.1 單元與組件測試 (Unit/Component Testing)**
    - [ ]  設定 Vitest。
    - [ ]  撰寫 Data Model 驗證測試。
    - [ ]  撰寫 Utility Functions 測試 (e.g. Date Utils)。
    - [ ]  **[🔍 驗證點] 執行 `npm run test`，確認所有核心邏輯測試通過。**
- [ ]  **4.2 端對端測試 (E2E Testing)**
    - [ ]  設定 Playwright。
    - [ ]  撰寫 "User Journey" 測試腳本 (Signup -> Capture -> Dispatch)。
    - [ ]  **[🔍 驗證點] 執行 E2E 測試腳本，確認關鍵路徑自動化測試通過。**
- [ ]  **4.3 安全性強化 (Security)**
    - [ ]  檢查 CouchDB Security Object 設定。
    - [ ]  驗證 IndexedDB 本地加密有效性。
    - [ ]  **[🔍 驗證點] 嘗試未授權存取 CouchDB 資料庫應被拒絕；檢查 IndexedDB 儲存內容應為加密編碼。**

---

## **Phase 5: 部署與初期驗證 (Deployment)**

**目標**：上線與驗證。

- [ ]  **5.1 後端部署 (Backend)**
    - [ ]  準備 Dockerfile (FastAPI + CouchDB 配置)。
    - [ ]  部署至雲端環境 (Fly.io/AWS)。
    - [ ]  設定 Domain 與 SSL 憑證。
- [ ]  **5.2 前端部署 (Frontend)**
    - [ ]  執行 Build 檢查。
    - [ ]  部署至 Vercel/Netlify。
    - [ ]  設定 Environment Variables。
    - [ ]  **[🔍 驗證點] 訪問正式環境網址，完整執行一次「註冊 -> 記錄筆記 -> 同步」流程，確認生產環境運作正常。**