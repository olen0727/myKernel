# Story 7.3: URL Content Parser 網址內容解析

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **輸入網址時自動抓取標題與內文(並盡可能地還原段落格式及圖片)**,
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

- [x] 實作 Parse Function (Edge Function or Backend)
    - [x] 使用 `cheerio` 或 `jsdom` 抓取 HTML。
    - [x] 使用 `Mozilla Readability` 提取主要內容。
    - [x] 轉換為 Markdown (使用 `turndown`)。
- [x] 前端呼叫邏輯
    - [x] 建立 `src/lib/parser-client.ts`。

## Dev Agent Record

### Implementation Notes
- Implemented Backend Parse API using FastAPI + Trafilatura (Architecture compliant).
- Note: Used `trafilatura` (Python) instead of `cheerio`/`readability` (Node.js) as per project's Backend Architecture choice.
- Created `frontend/src/lib/parser-client.ts` to consume the API.
- Integrated `parserClient` into `frontend/src/lib/content-parser.ts` replacing mock logic.
- Verified `QuickCaptureModal` automatically uses the new implementation.
- Added Backend tests `backend/tests/test_parser.py` covering success and fallback scenarios.

### File List
- backend/app/models/parser.py
- backend/app/services/parser.py
- backend/app/api/v1/parser.py
- backend/main.py (updated)
- backend/requirements.txt (updated)
- backend/tests/test_parser.py
- frontend/src/lib/parser-client.ts
- frontend/src/lib/content-parser.ts (updated)
- frontend/.env (updated port)

### Change Log
- 2026-02-04: Implemented URL Parser using FastAPI and Trafilatura. Integrated with Frontend Quick Capture.



## Dev Notes

### Architecture & Tech Stack
- **Lib**: `cheerio`, `@mozilla/readability`, `turndown`。
- **Environment**: 若無後端，暫時可在前端做簡單 fetch (需注意 CORS)，或使用 Proxy。建議使用 Vercel Edge Function 或類似 Serverless function。

### File Structure Requirements
- `api/parse.ts` (if using Next.js/Vercel) OR `src/services/parser.ts`.

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-7.3)
