# Kernel Implementation Tasks
> Based on PRD v2.3 & Tech Stack

此文件列出 Kernel 專案從初始化到上線的完整實作細節。

## Phase 1: 基礎建設與環境 (Foundation)
目標：建立穩固的開發地基，確保所有核心依賴與環境變數配置正確。

- [ ] **1.1 專案初始化**
    - [ ] 使用 `create-t3-app` 初始化專案 (Next.js 15, TypeScript, Tailwind, tRPC, Prisma)。
    - [ ] 設定 Git Repository 與 `.gitignore`。
    - [ ] 配置 `.editorconfig` 與 `prettier` / `eslint` 規則。
- [ ] **1.2 核心依賴安裝**
    - [ ] **UI 基礎**: `shadcn/ui` (init), `lucide-react`, `tailwindcss-animate`, `clsx`, `tailwind-merge`.
    - [ ] **狀態與邏輯**: `zustand` (Store), `nuqs` (URL State), `date-fns` (Time).
    - [ ] **表單與驗證**: `react-hook-form`, `zod`, `@hookform/resolvers`.
    - [ ] **編輯器**: `tiptap` 相關套件 (`@tiptap/react`, `@tiptap/starter-kit`, etc).
    - [ ] **日誌**: `pino`.
- [ ] **1.3 環境變數配置**
    - [ ] 建立 `.env` 檔案。
    - [ ] 設定 Supabase 連線資訊 (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    - [ ] 設定 NextAuth / Supabase Auth 相关密鑰。
- [ ] **1.4 多語系架構設置 (i18n)**
    - [ ] 安裝 `next-intl` 或 `i18next` + `react-i18next` (適配 App Router)。
    - [ ] 配置 `middleware.ts` 進行 Locale 偵測與重新導向 (預設 `zh-TW`)。
    - [ ] 建立字典檔結構 `src/messages/{locale}.json`。
    - [ ] 封裝 `I18nProvider` (Server/Client Component 支援)。
- [ ] **1.5 Hello World 驗證**
    - [ ] 啟動開發伺服器 `npm run dev`。
    - [ ] 確認首頁可存取，且 `/en` 與 `/zh-TW` 路由切換正常。

---

## Phase 2: 全站頁面實作 (All Pages Prototype)
目標：完成所有 UI/UX 互動，使用 Mock Data 驗證各種狀態。

### 2.1 Mock Data Factory
- [ ] **建立 Mock Data 架構 (`src/mocks`)**
    - [ ] 設定 `faker.js`。
    - [ ] 定義 TypeScript Interfaces (User, Resource, Project, Area, Task, Habit, Metric, Log).
- [ ] **實作假資料生成器**
    - [ ] `mockResources`: 包含各種類型 (Note/URL)、狀態 (Pending/Processed/Archived) 與內容長度。
    - [ ] `mockProjects`: 包含進度 (0% - 100%)、截止日期 (Overdue/Future)。
    - [ ] `mockAreas`: 包含封面圖與關聯習慣。
    - [ ] `mockMetrics`: 包含不同類型指標 (Number, Rating, Select)。
- [ ] **2.2 頁面實作 (需全面整合 i18n)**
    - [ ] **原則**: 所有 Hardcoded Text 需抽取至 `messages/*.json`。
    - [ ] **Auth Pages**
        - [ ] Login Page (`3.1.1`): 實作 OAuth 按鈕 (Google/GitHub) 與表單驗證 UI。
- [ ] **Inbox Pages**
    - [ ] Inbox List (`3.2.1`): 實作資源列表，支援 Hover Action。
    - [ ] Quick Capture Modal (`3.2.3`): 實作全域快捷鍵開啟、自動解析 URL/Text 邏輯 (模擬)。
- [ ] **Resource Pages**
    - [ ] Resource Library (`3.5.1`): 實作篩選器 (Filter Bar)，整合 `nuqs` 同步 URL 狀態。
    - [ ] Resource Editor (`3.2.2`): 整合 TipTap 編輯器，實作 Properties Sidebar (Project/Area 選擇器)。
- [ ] **Project Pages**
    - [ ] Workbench (`3.3.1`): 實作 `Doing` vs `Todo` 雙欄位，整合 `@dnd-kit/core` 拖拉排序。
    - [ ] Project Detail (`3.3.2`): 實作 Kanban/List 切換與進度條可視化。
- [ ] **Area Pages**
    - [ ] Area List (`3.4.1`): 實作 Grid Layout 與封面圖卡片。
    - [ ] Area Detail (`3.4.2`): 實作習慣管理器 (Habit Manager) UI (新增/暫停/刪除)。
- [ ] **Metrics & Journal**
    - [ ] Metrics Config (`3.6.3`): 實作指標增刪改查 UI。
    - [ ] Daily Journal (`3.7`): 實作每日回顧介面，整合習慣打卡與指標填寫表單。
- [ ] **Dashboard & Settings**
    - [ ] Dashboard (`3.9`): 使用 `recharts` 實作熱力圖 (Heatmap) 與趨勢圖。
    - [ ] Theme Toggle: 使用 `next-themes` 實作深色模式切換。

### 2.3 互動細節優化
- [ ] **全域通知**: 設定 `sonner` Toast，在操作成功/失敗時顯示提示。
- [ ] **Command Palette**: 使用 `cmdk` 實作全域搜尋 (整合 Mock Data)。
- [ ] **RWD 檢查**: 確保 Sidebar 在行動裝置可收折 (使用 `sheet` 或 `drawer`)。

---

## Phase 3: 資料庫與邏輯 (Backend Integration)
目標：串接真實數據，實作業務邏輯。

- [ ] **3.1 Database Schema**
    - [ ] 定義 `schema.prisma` (User, Account, Session, Resource, Project, Task, Area, Habit, Metric, JournalLog).
    - [ ] 執行 `prisma db push` 同步至 Supabase。
- [ ] **3.2 tRPC Routers Implementation**
    - [ ] **Resources Router**: CRUD, `process` (分流), `archive`.
        - [ ] 實作 `cheerio` URL 解析邏輯 (fetch title/meta)。
    - [ ] **Projects Router**: CRUD, `updateProgress`, `sortTasks`.
    - [ ] **Areas Router**: CRUD, `toggleHabit`.
    - [ ] **Journal Router**: `getDailyView`, `logHabit`, `logMetric`.
    - [ ] **Search Router**: Global search query.
- [ ] **3.3 前端串接**
    - [ ] 將所有 Mock Data 替換為 `trpc.useQuery`。
    - [ ] 將所有 Action (Create/Update/Delete) 替換為 `trpc.useMutation`。
    - [ ] 實作 Loading Skeleton 與 Error Handling。
- [ ] **3.4 Authentication & RLS**
    - [ ] 整合 Supabase Auth (Client & Server Side)。
    - [ ] 設定 PostgreSQL RLS Policy (僅允許 CRUD `auth.uid() = user_id` 的資料)。

---

## Phase 4: 測試與安全性 (QA & Security)
目標：確保品質與安全。

- [ ] **4.1 單元測試 (Unit Test)**
    - [ ] 設定 `vitest`。
    - [ ] 測試 Utils (如 Date formatter, Progress calculation)。
    - [ ] 測試 Custom Hooks。
- [ ] **4.2 End-to-End 測試 (E2E)**
    - [ ] 設定 `playwright`。
    - [ ] 測試腳本：User Login Flow。
    - [ ] 測試腳本：Create Resource -> Process to Project -> Complete Task。
- [ ] **4.3 安全性檢查**
    - [ ] 檢查 TipTap 輸出是否經過 `dompurify` 處理。
    - [ ] 檢查 Input 是否經過 `zod` 驗證。
    - [ ] 檢查 API 是否有未授權存取漏洞。

---

## Phase 5: 部署與監控 (Deployment)
目標：生產環境上線。

- [ ] **5.1 監控配置**
    - [ ] 設定 Sentry (Frontend & Backend) 捕捉 Crash。
    - [ ] 設定 PostHog 追蹤基礎 Usage。
- [ ] **5.2 Vercel 部署**
    - [ ] 設定 Build Command (`prisma generate && next build`).
    - [ ] 設定 Environment Variables (Production)。
    - [ ] 部署並驗證 Production URL。
- [ ] **5.3 Dogfooding**
    - [ ] 遷移個人真實資料。
    - [ ] 進行為期一週的日常使用測試。

---

## Phase 6 ~ 10: Launch Plan
(依照 PRD Roadmap 執行)
- [ ] Phase 6: Closed Beta (邀請制)
- [ ] Phase 7: Open Beta (公開註冊)
- [ ] Phase 8: Global Launch (多語系 & 收費)
