# Story 2.2: Habit Heatmap & Strength 連續達成天數

Status: ready-for-dev

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

- [ ] 安裝 Recharts
    - [ ] 確認 `recharts` 已安裝 (若未安裝需執行 `npm install recharts`)。
- [ ] 實作 Heatmap Component
    - [ ] 建立 `src/components/dashboard/HabitHeatmap.tsx`。
    - [ ] 準備 Mock Data (包含 dates, habits, status)。
    - [ ] 使用 Recharts `ScatterChart` 或自定義 SVG/Grid 實作熱力圖效果 (因標準 Recharts 無直接 Heatmap，可能需用 `Scatter` 模擬或改用 `GitHub-style` grid 實作)。
    - [ ] *替代方案*：若 Recharts 實作困難，可使用 CSS Grid 渲染簡單的方格矩陣。
- [ ] 整合 Streak 顯示
    - [ ] 在圖表旁或上方顯示習慣名稱與 Streak 數值。
- [ ] 整合至 Dashboard
    - [ ] 將 Heatmap 區塊加入 Dashboard 頁面。

## Dev Notes

### Architecture & Tech Stack
- **Data Visualization**: Recharts (優先嘗試) 或純 CSS Grid (備案)。
- **Lib**: `date-fns` 處理日期計算。

### File Structure Requirements
- `src/components/dashboard/HabitHeatmap.tsx`:熱力圖元件。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-2.2)
