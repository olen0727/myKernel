# Story 7.3: URL Content Parser 網址內容解析

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **輸入網址時自動抓取標題與摘要**,
So that **我可以省去手動複製貼上的時間**.

## Acceptance Criteria

1. **解析 API (Parse API)**
   - **Given** 後端 API Endpoint `/api/parse-url`，**When** 接收 POST 請求帶有 `url`，**Then** 回傳 Metadata。
   - **Response**: `{ title, description, image, content (markdown) }`。

2. **前端整合 (Frontend Integration)**
   - **Given** Quick Capture 或 Resource Editor，**When** 使用者貼上 URL，**Then** 自動呼叫解析 API。
   - **Then** 填入對應欄位 (Title, Context)。

3. **錯誤處理 (Error Handling)**
   - **Given** 解析失敗或 Timeout，**Then** 使用原始 URL 作為標題，且不中斷使用者操作。

## Tasks / Subtasks

- [ ] 實作 Parse Function (Edge Function or Backend)
    - [ ] 使用 `cheerio` 或 `jsdom` 抓取 HTML。
    - [ ] 使用 `Mozilla Readability` 提取主要內容。
    - [ ] 轉換為 Markdown (使用 `turndown`)。
- [ ] 前端呼叫邏輯
    - [ ] 建立 `src/lib/parser-client.ts`。

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `cheerio`, `@mozilla/readability`, `turndown`。
- **Environment**: 若無後端，暫時可在前端做簡單 fetch (需注意 CORS)，或使用 Proxy。建議使用 Vercel Edge Function 或類似 Serverless function。

### File Structure Requirements
- `api/parse.ts` (if using Next.js/Vercel) OR `src/services/parser.ts`.

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-7.3)
