#!/bin/bash
# GCP VM 初始化腳本 - 安裝 Docker 與 Docker Compose
set -e

echo "🚀 開始初始化 VM 環境..."

# 更新系統包
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 加入 Docker 官方 GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 設定 Docker repository (自動偵測是 Debian 還是 Ubuntu)
ID=$(grep -oP '(?<=^ID=).+' /etc/os-release | tr -d '"')
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$ID \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安裝 Docker 引擎
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 啟動並設定 Docker 開機自動啟動
sudo systemctl enable docker
sudo systemctl start docker

# 將當前使用者加入 docker 群組 (需重新登入生效)
sudo usermod -aG docker $USER

echo "✅ Docker 安裝完成！"
echo "⚠️  請結束當前的 SSH 連線並重新登入，以使群組設定生效。"
