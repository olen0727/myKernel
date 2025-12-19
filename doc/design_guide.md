# Kernel Design System Guide

**Version**: 1.0
**Target**: AI Coding Assistant / Frontend Developers
**Framework**: TailwindCSS v3.4+ / shadcn/ui

---

## **1. 設計哲學 (Design Philosophy)**

**Kernel** 的介面設計旨在創造一種 **「沉浸式的心流體驗 (Immersive Flow State)」**。
它不應只是一個工具，而是一個讓思緒安靜、專注力提升的數位聖所。

*   **Premium & Minimalist**: 拒絕廉價的通用感。使用細膩的邊框、深邃的背景與精心調教的陰影。
*   **Data-Ink Ratio**: 極大化資訊內容，極小化裝飾雜訊。介面應像隱形一樣，只在需要時浮現。
*   **Tactile & Responsive**: 透過微交互 (Micro-interactions) 賦予軟體「觸感」。每一個點擊、懸停與輸入都應獲得即時且優雅的反饋。

---

## **2. 色彩系統 (Color System)**

系統預設為 **深色模式 (Dark Mode)** 優先。淺色模式僅為輔助。

### **2.1 主題色盤 (Thematic Palette)**

我們不使用純黑 (`#000000`)，而是使用帶有冷色調的深灰，創造高級感。

| Token Name | Hex Code (Dark) | Hex Code (Light) | Usage |
| :--- | :--- | :--- | :--- |
| **`bg-background`** | `#09090B` (Zinc-950) | `#FFFFFF` | 應用程式基底背景 |
| **`bg-surface`** | `#18181B` (Zinc-900) | `#F4F4F5` (Zinc-100) | 卡片、側欄、浮層 |
| **`bg-elevated`** | `#27272A` (Zinc-800) | `#E4E4E7` (Zinc-200) | Modal, Popover |
| **`border-subtle`** | `#27272A` (Zinc-800) | `#E4E4E7` | 分隔線、預設邊框 |
| **`text-primary`** | `#FAFAFA` (Zinc-50) | `#09090B` | 二級以上標題、正文 |
| **`text-muted`** | `#A1A1AA` (Zinc-400) | `#71717A` | 說明文字、次要資訊 |

### **2.2 品牌識別色 (Brand Accents)**

Kernel 的品牌識別是一種 **「極光般的流動感 (Aurora Glow)」**，而非單一色塊。

*   **Primary Accent**: **Indigo to Violet Gradient**
    *   Start: `#6366f1` (Indigo-500)
    *   End: `#8b5cf6` (Violet-500)
    *   *Usage*: 關鍵按鈕 (CTA)、Logo 光暈、進度條、選取狀態。

*   **Functional Colors**:
    *   **Success**: `#10b981` (Emerald-500) - 完成任務、達成習慣
    *   **Warning**: `#f59e0b` (Amber-500) - 未完成提醒
    *   **Destructive**: `#ef4444` (Red-500) - 刪除、嚴重錯誤

---

## **3. 排版與字型 (Typography)**

*   **Font Family**:
    *   English: **Inter** (Variable weight, tight tracking for UI)
    *   Chinese: **Noto Sans TC** (PingFang TC fallback)
    *   Monospace: **JetBrains Mono** (for code blocks)

*   **Scale**:
    *   **H1**: `text-4xl font-bold tracking-tight` (頁面主標題)
    *   **H2**: `text-2xl font-semibold tracking-tight` (區塊標題)
    *   **H3**: `text-lg font-medium` (卡片標題)
    *   **Body**: `text-sm font-normal leading-relaxed` (預設內文)
    *   **Small**: `text-xs text-muted-foreground` (Meta 資訊)

---

## **4. UI 元件規範 (Component Guidelines)**

我們全面採用 **shadcn/ui** 作為元件基礎，但需進行客製化以符合 Kernel 風格。

### **4.1 按鈕 (Buttons)**

*   **Primary**: 使用 Brand Gradient 背景，白色文字，Hover 時增加亮度與陰影。
    *   `bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-all`
*   **Secondary/Ghost**: 透明背景，Hover 時顯示微弱的 Zinc-800 背景。
*   **Border Radius**: 統一套用 `rounded-md` (6px)，避免過圓 (Pill) 或過方。

### **4.2 卡片 (Cards)**

*   **玻璃擬態 (Glassmorphism Lite)**: 在深色模式下，卡片背景應略帶透明並疊加 Blur 效果。
    *   `bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50`
*   **互動感**: 可點擊的卡片在 Hover 時應有輕微的 `scale-105` 或 `border-indigo-500/30` 發光效果。

### **4.3 模態視窗 (Modals / Dialogs)**

*   **Backdrop**: 使用深色遮罩 `bg-black/80 backdrop-blur-sm`，讓背景完全失焦，聚焦於當前任務。
*   **Animation**: 必須有 `enter` 與 `exit` 動畫 (Fade in + Scale up)。

---

## **5. 佈局與間距 (Layout & Spacing)**

*   **Grid System**: 採用 4px 為基數的 Grid。
    *   常見間距: `gap-4` (16px), `gap-6` (24px), `p-6` (24px).
*   **Sidebar**: 固定寬度 (e.g., 240px)，在小螢幕上收折為 Icon Bar。
*   **Max Width**: 內容區域通常限制在 `max-w-5xl` 並置中，避免在大螢幕上閱讀困難。

---

## **6. AI Coding 實作提示 (Prompting Hints)**

當 AI 生成 UI 時，請遵循以下指令以確保風格一致：

> "Use **Tailwind CSS** with a **mobile-first** approach."
> "Implement a **dark-mode first** design using Zinc colors for neutrals."
> "Apply **inter** font and **tracking-tight** for headings."
> "Use **gradients** sparingly, only for primary actions or brand accents."
> "Ensure all interactive elements have **hover** and **focus-visible** states."
> "For cards and surfaces, use subtle **boder-white/10** to define edges in dark mode."

---
