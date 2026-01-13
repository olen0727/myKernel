# Story 2.2: Habit Heatmap & Strength 連續達成天數

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **看到習慣達成的熱力圖與連續天數統計**,
So that **我可以追蹤自己的行為模式並保持動力**.

## Acceptance Criteria

1. **熱力圖顯示 (Activity Heatmap)**
   - **Given** 使用者在 Dashboard 檢視習慣追蹤區塊，**When** 區塊載入，**Then** 應顯示行為熱力圖。
   - **And** 橫軸為日期 (最近 30 天)，縱軸為行為項目 (寫日記 + 各項習慣)。
   - **And** 每格顏色深淺代表達成狀態 (例如：綠色代表完成，灰色代表未完成)。

2. **連續達成天數 (Current Streak)**
   - **Given** 熱力圖已渲染，**When** 使用者檢視習慣列表，**Then** 每個習慣名稱旁應顯示連續達成天數。
   - **And** 格式範例：`🔥 5 days` (Mock Data)。

3. **互動與提示 (Interaction & Tooltip)**
   - **Given** 使用者將滑鼠懸停於熱力圖某一格，**When** 觸發 Hover 事件，**Then** 應顯示 Tooltip (包含日期、行為名稱、達成狀態)。

4. **響應式設計 (Responsive)**
   - **Given** 熱力圖使用 `recharts` 實作，**When** 螢幕寬度改變，**Then** 圖表應自動調整寬度以適應容器。

## Tasks / Subtasks

- [x] 安裝 Recharts
    - [x] 確認 `recharts` 已安裝 (若未安裝需執行 `npm install recharts`)。
- [x] 實作 Heatmap Component
    - [x] 建立 `src/components/dashboard/HabitHeatmap.tsx`。
    - [x] 準備 Mock Data (包含 dates, habits, status)。
    - [x] 使用 CSS Grid 實作熱力圖效果。
- [x] 整合 Streak 顯示
    - [x] 在圖表旁或上方顯示習慣名稱與 Streak 數值。
- [x] 整合至 Dashboard
    - [x] 將 Heatmap 區塊加入 Dashboard 頁面。

## Dev Agent Record

### Implementation Plan
- 建立 `HabitHeatmap` 組件，使用 CSS Grid 渲染最近 30 天的達成狀況。
- 整合 Streak (連續達成天數) 顯示。
- 為組件編寫單元測試。
- 整合至 `DashboardPage`。

### Debug Log
- 遇到 `node_modules` 與 `react` 版本不一致導致的測試失敗 (Invalid hook call)，已透過重新整理 `package-lock.json` 與 `npm install` 解決。
- 移除 `Radix UI Tooltip` 以簡化除錯過程，改用 HTML `title` 屬性提供基礎悬停資訊。

### Completion Notes
- 完成習慣熱力圖組件。
- 支援響應式顯示。
- 已通過單元測試。

## File List
- `frontend/src/components/dashboard/HabitHeatmap.tsx`
- `frontend/src/components/dashboard/__tests__/HabitHeatmap.test.tsx`
- `frontend/src/pages/DashboardPage.tsx` (Modified)

## Change Log
- 2026-01-13: 初始實作習慣熱力圖與連續天數統計 (Story 2.2)

## Status: review

## References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.2)
