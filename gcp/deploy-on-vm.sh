#!/bin/bash
# GCP 部署執行腳本
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 開始部署 Kernel 服務..."

# 檢查 .env 檔案
if [ ! -f .env ]; then
    echo "❌ 找不到 .env 檔案。"
    if [ -f backend/.env.example ]; then
        echo "📝 正在為您從 backend/.env.example 建立 .env ..."
        cp backend/.env.example .env
        echo "⚠️  請編輯根目錄下的 .env 檔案，設定 COUCHDB_USER 與 COUCHDB_PASSWORD 再繼續。"
        exit 1
    else
        echo "❌ 找不到 .env.example，請手動建立 .env 並設定環境變數。"
        exit 1
    fi
fi

# 啟動服務
echo "🐳 正在使用 Docker Compose 啟動生產環境服務 (包含最新代碼編譯)..."
docker compose -f docker-compose.prod.yml up -d --build

echo "✅ 服務啟動指令已送出！"
echo "🔍 您可以執行 'docker compose -f docker-compose.prod.yml ps' 查看狀態。"
