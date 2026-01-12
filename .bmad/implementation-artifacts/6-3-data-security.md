# Story 6.3: Local Data Encryption 資料加密與安全性

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **我的私人筆記與數據在本地儲存時經過加密**,
So that **即使裝置遺失，資料也不會輕易被讀取**.

## Acceptance Criteria

1. **欄位加密 (Field Encryption)**
   - **Given** RxDB Schema 中標記為 `encrypted: true` 的欄位 (e.g., Resource content, Journal note)，**When** 儲存至 IndexedDB，**Then** 內容應已被加密 (AES-256)。

2. **密鑰管理 (Key Management)**
   - **Then** 應實作 Password/Key 輸入機制 (Mock for MVP: 可先寫死或使用簡單 Prompt)。
   - **Given** 正確密鑰，**Then** 應用程式能解密並顯示內容。
   - **Given** 錯誤密鑰，**Then** 初始化失敗或無法讀取加密欄位。

## Tasks / Subtasks

- [ ] 配置 RxDB Encryption Plugin
    - [ ] `npm install rxdb-utils` or check `rxdb` core if included.
    - [ ] 在 `createDatabase` 時設定 password。
- [ ] 驗證加密
    - [ ] 透過 DevTools 下查看 IndexedDB 內容，確認為亂碼。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `rxdb` encryption module.

### File Structure Requirements
- `src/db/database.ts`: 加密配置。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-6.3)
