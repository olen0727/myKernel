# Story 7.1: OAuth Integration 身分驗證整合

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **使用 Google 或 GitHub 帳號登入系統**,
So that **我不需要記憶新的帳號密碼，並能確保身分安全**.

## Acceptance Criteria

1. **登入頁面 (Login Page)**
   - **Given** 未登入使用者訪問應用程式，**Then** 重導向至 `/login`。
   - **Then** 顯示 "Continue with Google" 與 "Continue with GitHub" 按鈕。

2. **OAuth 流程 (OAuth Flow)**
   - **Given** 點擊登入按鈕，**Then** 導向至 Auth Provider。
   - **Given** 驗證成功，**Then** callback 回應用程式，並取得 JWT/Session。

3. **User Profile (個人資料)**
   - **Given** 登入成功，**Then** 應用程式應取得並儲存使用者 Name, Email, Avatar URL。

## Tasks / Subtasks

- [x] Firebase Auth 集成 (或 Supabase/Auth0)
    - [x] 對應 `_bmad/config.yaml` 或專案設定，選擇 Auth Provider (假設 Firebase/Supabase)。
    - [x] 實作 `src/lib/auth.ts` (Implemented as `src/services/auth-service.ts`).
- [x] 實作 AuthContext
    - [x] 建立 `src/providers/AuthProvider.tsx`。
    - [x] 提供 `useAuth` hook (user, login, logout)。
- [x] 實作 LoginPage
    - [x] 建立 `src/pages/LoginPage.tsx`。

### Review Follow-ups (AI)
- [x] [AI-Review][CRITICAL] **Data Isolation**: Frontend DB sync currently points to global collections instead of per-user databases (`userdb-{uuid}`) defined in Architecture. Must refactor `database.ts` to perform sync *after* login with dynamic URLs.
- [x] [AI-Review][CRITICAL] **Backend Security**: `auth.py` implementation is purely mock and allows arbitrary login bypass. Must implement proper structure for JWT provision and user DB creation (even if mocked for dev).
- [x] [AI-Review][MEDIUM] **Sync Coordination**: DB initialization happens before Auth. startup. Should coordinate to avoid 401 errors and ensure correct DB target.

## Dev Notes

### Architecture & Tech Stack
- **Lib**: `firebase/auth` or `@supabase/supabase-js`.
- **State**: React Context.

### File Structure Requirements
- `src/lib/auth.ts`: 驗證核心。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-7.1)

## Change Log
- 2026-01-30: Implemented OAuth logic using FastAPI backend flow (Architecture 7.1) instead of Firebase SDK. Created AuthService, AuthProvider and LoginPage.

## Dev Agent Record
Implemented AuthService using REST API to backend as per Architecture 7.1. 
Replaced direct Firebase/Supabase SDK assumption with standard backend-mediated OAuth flow.
Added automatic redirect to Login page in AppLayout.
Validated with Unit Tests.

## File List
- frontend/src/services/auth-service.ts
- frontend/src/services/__tests__/auth-service.test.ts
- frontend/src/providers/AuthProvider.tsx
- frontend/src/providers/__tests__/AuthProvider.test.tsx
- frontend/src/pages/LoginPage.tsx
- frontend/src/layouts/AppLayout.tsx
- frontend/src/main.tsx
- frontend/src/types/models.ts
