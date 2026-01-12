# Story 4.1: Area List & Grid 領域列表與網格

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **使用者**,
I want **以視覺化的卡片網格檢視所有領域**,
So that **我可以看到人生版圖的全貌，並快速進入感興趣的領域**.

## Acceptance Criteria

1. **領域網格顯示 (Grid Display)**
   - **Given** 使用者訪問 Areas 頁面 (`/areas`)，**When** 頁面載入，**Then** 應顯示網格視圖 (Grid Layout)。

2. **領域卡片內容 (Card Content)**
   - **Then** 每張卡片應包含：
     - **上半部**: 滿版封面圖 (Cover Image)。
     - **下半部**: 領域名稱、狀態燈號 (Active/Hidden)、關鍵統計 (Active Projects 數 / Habits 數)。

3. **新增入口 (New Area Entry)**
   - **Then** 領域列表末端應顯示 `[+ New Area]` 卡片作為新增入口。

4. **新增模態 (Create Modal)**
   - **Given** 使用者點擊 `[+ New Area]`，**When** 模態開啟，**Then** 應顯示 Name 輸入框 (必填) 與預設封面圖選擇器 (Mock)。

## Tasks / Subtasks

- [ ] 實作 AreaListPage
    - [ ] 建立 `src/pages/AreaListPage.tsx`。
- [ ] 實作 AreaCard Component
    - [ ] 建立 `src/components/areas/AreaCard.tsx`。
    - [ ] 上半部使用 `img` tag (object-cover)，下半部顯示 info。
- [ ] 實作 CreateAreaModal
    - [ ] 建立 `src/components/areas/CreateAreaModal.tsx`。

## Dev Notes

### Architecture & Tech Stack
- **Component**: Shadcn/UI (Dialog, AspectRatio for cover image)。

### File Structure Requirements
- `src/pages/AreaListPage.tsx`: 領域列表頁。
- `src/components/areas/AreaCard.tsx`: 領域卡片。

### References
- [Architecture](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/architecture.md)
- [Epics](file:///c:/Users/olen/.gemini/antigravity/scratch/Kernel/.bmad/planning-artifacts/epics.md#Story-4.1)
