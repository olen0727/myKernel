# Kernel

**Kernel** 是一個集成了筆記、任務管理、習慣追蹤以及網頁內容擷取的個人知識管理系統 (PKM)。專案採用 **Offline-First** 架構設計，確保資料在無網路狀態下仍可操作，並透過 CouchDB 進行多端同步。

## ✨ 特色功能

- **Offline-First 架構**：基於 RxDB 與 PouchDB，所有操作在本地進行，隨後自動與伺服器同步。
- **現代化編輯器**：集成 Plate.js 提供豐富的文字編輯體驗。
- **網頁內容擷取**：後端提供 URL 解析服務 (基於 Trafilatura)，可擷取並保存網頁內容。
- **多功能整合**：包含日記 (Journal)、習慣 (Habits)、任務 (Tasks) 與專案管理 (Projects)。
- **跨平台同步**：支援多設備間的即時資料同步。

## 🛠️ 技術棧

### 前端 (Frontend)
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State & Data**: [RxDB](https://rxdb.info/) (Local-first Database), [Zustand](https://zustand-demo.pmnd.rs/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Editor**: [Plate.js](https://platejs.org/)

### 後端 (Backend Service)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Scraping**: Trafilatura, BeautifulSoup4

### 資料庫 (Database)
- **Container**: [Apache CouchDB](https://couchdb.apache.org/) (作為同步伺服器)

## 🚀 快速開始

### 前置需求
- Docker & Docker Compose
- Node.js (v18+)
- Python (v3.10+)

### 透過 Docker 啟動 (推薦)

最簡單的方式是使用 Docker Compose 一鍵啟動所有服務：

```bash
# 1. 克隆專案
git clone https://github.com/olen0727/myKernel.git
cd myKernel

# 2. 設定環境變數 (請參考 .env.example 建立 .env 檔案)
# 確保根目錄、frontend/、backend/ 都有適當的 .env 設定

# 3. 啟動服務
docker-compose up -d
```

啟動後，您可以訪問：
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/docs
- **CouchDB Admin**: http://localhost:5984/_utils

### 本地開發 (Local Development)

若您想分別開發前後端：

**1. 啟動資料庫**
```bash
docker-compose up -d couchdb
```

**2. 啟動後端**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**3. 啟動前端**
```bash
cd frontend
npm install
npm run dev
```

## 📂 專案結構

```
Kernel/
├── backend/          # Python FastAPI 服務 (爬蟲、Auth)
├── frontend/         # React 前端應用
├── couchdb/          # CouchDB 配置
├── docker-compose.yml # 服務編排配置
└── init-project.sh   # 初始化腳本
```

## 🔧 環境變數配置

請確保在 `docker-compose.yml` 或 `.env` 中設定以下關鍵變數：

- `COUCHDB_USER`: 資料庫管理員帳號
- `COUCHDB_PASSWORD`: 資料庫管理員密碼
- `VITE_API_URL`: 後端 API 地址 (預設 http://localhost:8000 或 http://localhost:5001)
- `VITE_COUCHDB_URL`: CouchDB 地址 (預設 http://localhost:5984)

## 📝 License

[MIT](LICENSE)
