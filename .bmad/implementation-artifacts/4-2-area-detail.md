# Story 4.2: Area Detail Layout 領域詳情頁

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **在領域詳情頁看到完整的領域資訊、關聯專案與習慣管理區**,
So that **我可以全面維護這個人生責任範圍**.

## Acceptance Criteria

1. **詳情頁結構 (Structure)**
   - **Given** 使用者訪問 Area Detail (`/areas/:id`)，**Then** 應顯示 Main Content (左) + Sidebar (右) 結構。
   - **Header**: 顯示滿版背景圖、標題 (Inline Edit)、核心統計 (Active Projects/Habits)。

2. **內容區塊 (Main Content)**
   - **Then** 左側包含：習慣管理區 (Habit Manager - 列表 placeholder)、進行中專案 (Project Cards loop)。

3. **側欄區塊 (Sidebar)**
   - **Then** 右側包含：描述 (Editable Textarea)、關聯資源 (Links)、Hidden Toggle、Delete 按鈕。

4. **互動 (Interactions)**
   - **Given** 點擊 Header 封面圖，**Then** 彈出圖片更換 Mock UI。
   - **Given** 點擊 Delete，**Then** 需二次確認。

## Tasks / Subtasks

- [ ] 實作 AreaDetailPage
    - [ ] 建立 `src/pages/AreaDetailPage.tsx`。
- [ ] 實作 AreaHeader Component
    - [ ] 支援背景圖顯示與標題編輯。
- [ ] 實作 AreaSidebar Component
    - [ ] 實作屬性編輯與刪除邏輯。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Switch for hidden toggle, Textarea)。

### File Structure Requirements
- `src/pages/AreaDetailPage.tsx`: 領域詳情頁。
- `src/components/areas/AreaHeader.tsx`: 頁頭。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-4.2)
