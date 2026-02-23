import { startOfDay, subDays, subHours, format } from "date-fns"

export interface MetricData {
    date: Date
    label: string
    value: number
}

/**
 * 產生模擬指標數據
 * @param days 天數
 * @param min 最小值
 * @param max 最大值
 */
export const generateMockMetricData = (days: number, min: number, max: number): MetricData[] => {
    const data: MetricData[] = []
    const now = startOfDay(new Date())
    for (let i = days; i >= 0; i--) {
        const date = subDays(now, i)
        data.push({
            date,
            label: format(date, "MM/dd"),
            value: Math.floor(Math.random() * (max - min + 1)) + min
        })
    }
    return data
}

export interface ResourceFootprint {
    id: string
    title: string
    type: "note" | "link" | "journal"
    action: "created" | "modified"
    timestamp: Date
    summary?: string
}

// --- Inbox Mock Data ---
export interface Resource {
    id: string
    type: "note" | "link"
    title: string
    summary: string
    timestamp: Date
    url?: string
}

export const INITIAL_INBOX_RESOURCES: Resource[] = [
    {
        id: "1",
        type: "note",
        title: "Kernel 產品核心理念筆記",
        summary: "這是一份關於 Kernel 的設計哲學筆記，涵蓋了『腦同步』與『收件匣』的核心概念...",
        timestamp: subHours(new Date(), 2),
    },
    {
        id: "2",
        type: "link",
        title: "Building a Second Brain - Tiago Forte",
        summary: "深入探討 CODE 框架：Capture, Organize, Distill, Express，如何建立數位大腦...",
        timestamp: subHours(new Date(), 5),
        url: "https://fortelabs.com/blog/basb/"
    },
    {
        id: "3",
        type: "note",
        title: "2026 年個人發展目標思考",
        summary: "從健康、事業、財務、人際關係四個維度設定 OKRs，並將其拆解為可執行的習慣...",
        timestamp: subDays(new Date(), 1),
    },
    {
        id: "4",
        type: "link",
        title: "React 19 Server Components 深度解析",
        summary: "這篇技術文章詳細說明了 React 19 對於伺服器元件的優化以及更簡單的資料獲取模式...",
        timestamp: subDays(new Date(), 1),
        url: "https://react.dev/blog/react-19"
    }
]

// --- Project Mock Data ---
export interface Task {
    id: string
    title: string
    completed: boolean
}

export interface TaskListGroup {
    id: string
    title: string
    items: Task[]
}

export const INITIAL_TASK_LISTS: TaskListGroup[] = [
    {
        id: "list-1",
        title: "第一階段：開發環境準備",
        items: [
            { id: "task-1", title: "初始化 React + Vite 專案", completed: true },
            { id: "task-2", title: "配置 Tailwind CSS", completed: true },
            { id: "task-3", title: "設定 Shadcn UI 組件庫", completed: false },
        ]
    },
    {
        id: "list-2",
        title: "第二階段：核心 UI 實作",
        items: [
            { id: "task-4", title: "實作專案列表頁面", completed: false },
            { id: "task-5", title: "開發專案詳情頁", completed: false },
        ]
    }
]

export const INITIAL_PROJECTS = [
    {
        id: "1",
        name: "Kernel Core 開發",
        description: "本專案旨在建立個人生產力系統的核心架構，包含收件匣、領域管理與專案追蹤。",
        area: "Work 職涯與專業",
        status: "active" as const,
        dueDate: new Date(2026, 5, 30),
    },
    {
        id: "2",
        name: "閱讀清單：數位大腦",
        description: "整理與閱讀關於第二大腦、知識管理的相關書籍與文章。",
        area: "Self-Growth 自我成長",
        status: "active" as const,
        dueDate: new Date(2026, 2, 15),
    },
    {
        id: "3",
        name: "馬拉松訓練計畫",
        description: "為 2026 年底的台北馬拉松做準備，包含每週的跑量安排與耐力訓練。",
        area: "Health & Fitness 健康",
        status: "active" as const,
        dueDate: new Date(2026, 11, 20),
    },
    {
        id: "4",
        name: "資產配置優化",
        description: "檢視目前的投資組合，並根據 2026 年的市場環境進行再平衡。",
        area: "Finance 財務管理",
        status: "active" as const,
        dueDate: new Date(2026, 1, 1),
    },
    {
        id: "5",
        name: "系統架構重構 (Phase 2)",
        description: "針對現有的 UI 組件進行效能優化與無障礙功能增強。",
        area: "Work 職涯與專業",
        status: "active" as const,
        dueDate: new Date(2026, 8, 15),
    }
]

export const INITIAL_PROJECT = INITIAL_PROJECTS[0]

export interface ProjectResource {
    id: string
    type: "note" | "link"
    title: string
    content: string
    createdAt: Date
}

export const INITIAL_PROJECT_RESOURCES: ProjectResource[] = [
    {
        id: "res-1",
        type: "note",
        title: "專案架構設計筆記",
        content: "本專案採用 React + Vite 作為前端框架，使用 RxDB 作為本地資料庫實現離線優先架構。UI 元件庫選用 Shadcn/UI，搭配 Tailwind CSS 進行樣式管理...",
        createdAt: new Date(2026, 0, 10),
    },
    {
        id: "res-2",
        type: "link",
        title: "Shadcn/UI 官方文件",
        content: "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
        createdAt: new Date(2026, 0, 8),
    },
    {
        id: "res-3",
        type: "note",
        title: "用戶訪談紀錄 - 第一輪",
        content: "訪談對象：5 位目標用戶。主要發現：用戶普遍對現有任務管理工具感到不滿，主要痛點包括：1) 跨裝置同步困難 2) 介面過於複雜 3) 缺乏彈性的組織方式...",
        createdAt: new Date(2026, 0, 5),
    },
]

// --- Dashboard Mock Data ---
export const DASHBOARD_STATS = [
    { title: "腦同步天數 (Brain-Sync Days)", value: 42, description: "寫過日記的總天數" },
    { title: "Inbox 未處理數", value: 5, description: "待處理資源數量" },
    { title: "進行中專案 (Active Projects)", value: 3, description: "Active 狀態專案" },
    { title: "待辦任務 (Total Tasks)", value: 12, description: "未完成任務總量" },
]

// --- Habits Mock Data ---
export interface Habit {
    id: string
    name: string
    currentStreak: number
    maxStreak: number
    status: "active" | "paused"
    frequency: "daily" | "weekly"
    days?: number[] // 0-6 for Sun-Sat
    areaId: string
    completedDates: string[] // YYYY-MM-DD
}

export const HABITS: Habit[] = [
    { id: "1", name: "寫日記", currentStreak: 42, maxStreak: 60, status: "active", frequency: "daily", areaId: "1", completedDates: [] },
    { id: "2", name: "閱讀 30 分鐘", currentStreak: 5, maxStreak: 15, status: "active", frequency: "daily", areaId: "2", completedDates: [] },
    { id: "3", name: "冥想", currentStreak: 12, maxStreak: 12, status: "active", frequency: "daily", areaId: "2", completedDates: [] },
    { id: "4", name: "運動", currentStreak: 3, maxStreak: 10, status: "active", frequency: "weekly", days: [1, 3, 5], areaId: "3", completedDates: [] },
]

// --- Area Mock Data ---
export interface Area {
    id: string
    name: string
    status: "active" | "hidden"
    projectCount: number
    habitCount: number
    coverImage: string
    description?: string
}

export const INITIAL_AREAS: Area[] = [
    {
        id: "1",
        name: "Work 職涯與專業",
        status: "active",
        projectCount: 3,
        habitCount: 2,
        coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
        description: "專注於職業技能發展、專案管理與專業網絡建立。"
    },
    {
        id: "2",
        name: "Self-Growth 自我成長",
        status: "active",
        projectCount: 5,
        habitCount: 4,
        coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
        description: "涵蓋內在修養、知識學習與心理素質的提升。"
    },
    {
        id: "3",
        name: "Health & Fitness 健康",
        status: "active",
        projectCount: 1,
        habitCount: 3,
        coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
        description: "維持身體健康、規律運動與營養均衡的飲食習慣。"
    },
    {
        id: "4",
        name: "Finance 財務管理",
        status: "active",
        projectCount: 2,
        habitCount: 1,
        coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
        description: "資產配置、開支追蹤與長期財務目標的達成。"
    }
]

// --- Metric Mock Data ---
export interface MetricDefinition {
    id: string
    name: string
    type: 'number' | 'rating' | 'select' | 'time'
    min?: number
    max?: number
    step?: number
    unit?: string
    status: 'active' | 'archived'
    isSystem: boolean
    options?: string[] // For select type
}

export interface MetricEntry {
    date: string // YYYY-MM-DD
    metricId: string
    value: number
    metadata?: Record<string, any>
}

export const METRIC_DEFINITIONS: MetricDefinition[] = [
    { id: 'mood', name: '心情 (Mood)', type: 'rating', min: 1, max: 5, status: 'active', isSystem: true },
    { id: 'energy', name: '能量 (Energy)', type: 'rating', min: 1, max: 5, status: 'active', isSystem: true },
    { id: 'sleep', name: '睡眠 (Sleep)', type: 'number', min: 0, max: 24, step: 0.5, unit: 'hrs', status: 'active', isSystem: true },
    { id: 'focus', name: '專注度 (Focus)', type: 'rating', min: 1, max: 10, status: 'active', isSystem: false },
]

// --- Journal Mock Data ---
export interface JournalEntry {
    id: string
    date: string // YYYY-MM-DD
    content: string
    createdAt: Date
    updatedAt: Date
}

// --- Persistent store simulation ---
class DataStore {
    private areas: Area[] = [...INITIAL_AREAS]
    private habits: Habit[] = [...HABITS]
    private metricEntries: MetricEntry[] = []
    private metricDefinitions: MetricDefinition[] = [...METRIC_DEFINITIONS]
    private journalEntries: JournalEntry[] = []

    // Journal
    getJournalEntry(date: string) {
        return this.journalEntries.find(e => e.date === date)
    }

    saveJournalEntry(date: string, content: string) {
        const index = this.journalEntries.findIndex(e => e.date === date)
        if (index >= 0) {
            this.journalEntries[index].content = content
            this.journalEntries[index].updatedAt = new Date()
        } else {
            this.journalEntries.push({
                id: crypto.randomUUID(),
                date,
                content,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }
    }

    // Metrics
    getMetricDefinitions() { return this.metricDefinitions }

    addMetricDefinition(def: MetricDefinition) {
        this.metricDefinitions.push(def)
    }

    updateMetricDefinition(id: string, updates: Partial<MetricDefinition>) {
        this.metricDefinitions = this.metricDefinitions.map(d => d.id === id ? { ...d, ...updates } : d)
    }

    deleteMetricDefinition(id: string) {
        this.metricDefinitions = this.metricDefinitions.filter(d => d.id !== id)
    }

    getMetricEntries(date: string) {
        return this.metricEntries.filter(e => e.date === date)
    }

    saveMetricEntry(date: string, metricId: string, value: number, metadata?: Record<string, any>) {
        const index = this.metricEntries.findIndex(e => e.date === date && e.metricId === metricId)
        if (index >= 0) {
            this.metricEntries[index].value = value
            if (metadata) {
                this.metricEntries[index].metadata = { ...this.metricEntries[index].metadata, ...metadata }
            }
        } else {
            this.metricEntries.push({ date, metricId, value, metadata })
        }
    }

    deleteMetricEntry(date: string, metricId: string) {
        this.metricEntries = this.metricEntries.filter(e => !(e.date === date && e.metricId === metricId))
    }


    // Areas
    getAreas() { return this.areas }
    getAreaById(id: string) { return this.areas.find(a => a.id === id) }
    addArea(area: Area) { this.areas.push(area) }
    updateArea(id: string, updates: Partial<Area>) {
        this.areas = this.areas.map(a => a.id === id ? { ...a, ...updates } : a)
    }
    deleteArea(id: string) {
        this.areas = this.areas.filter(a => a.id !== id)
    }

    // Habits
    getAllHabits() { return this.habits }
    getHabitsByArea(areaId: string) { return this.habits.filter(h => h.areaId === areaId) }
    addHabit(habit: Habit) {
        if (!habit.completedDates) habit.completedDates = []
        this.habits.push(habit)
    }
    updateHabit(id: string, updates: Partial<Habit>) {
        this.habits = this.habits.map(h => h.id === id ? { ...h, ...updates } : h)
    }
    deleteHabit(id: string) {
        this.habits = this.habits.filter(h => h.id !== id)
    }

    toggleHabitCompletion(habitId: string, dateStr: string) {
        const habit = this.habits.find(h => h.id === habitId)
        if (!habit) return

        const isCompleted = habit.completedDates.includes(dateStr)
        let newCompletedDates = [...habit.completedDates]

        if (isCompleted) {
            newCompletedDates = newCompletedDates.filter(d => d !== dateStr)
        } else {
            newCompletedDates.push(dateStr)
        }

        // Recalculate streak
        // Sort dates descending
        newCompletedDates.sort((a, b) => b.localeCompare(a))

        let newStreak = 0
        if (newCompletedDates.length > 0) {
            // Check if the most recent completion is today or yesterday (to allow keeping streak alive)
            // But for "current streak", usually it means consecutive days ending today or yesterday.
            // For this mock, let's just count backwards from the most recent completed date
            // IF that date is recent enough.

            // const today = format(new Date(), 'yyyy-MM-dd') // Unused
            const latest = newCompletedDates[0]

            // simple check: if strict streak, needs to include today or yesterday?
            // let's just count consecutive days from the latest completion backwards

            let current = new Date(latest)
            newStreak = 1

            for (let i = 1; i < newCompletedDates.length; i++) {
                const prevDate = subDays(current, 1)
                const prevDateStr = format(prevDate, 'yyyy-MM-dd')

                if (newCompletedDates[i] === prevDateStr) {
                    newStreak++
                    current = prevDate
                } else {
                    break
                }
            }
        }

        this.updateHabit(habitId, { completedDates: newCompletedDates, currentStreak: newStreak })
    }

    // Projects
    getProjectsByArea(areaName: string) {
        // Mock project filtering by area name or substring
        return INITIAL_PROJECTS.filter(p =>
            p.area === areaName ||
            areaName.includes(p.area) ||
            p.area.includes(areaName.split(' ')[0])
        )
    }

    // Resources
    getResourcesByArea(areaId: string) {
        // Mock filtering some resources for the area
        // In a real app, this would be based on a link table
        // 使用字串雜湊代替 parseInt 以支援 UUID
        const hash = areaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return INITIAL_INBOX_RESOURCES.filter((_, idx) => (idx + hash) % 3 === 0)
    }

    // Task Stats helper
    getProjectStats(projectId: string) {
        // In a real app, this would query tasks table
        const total = 5
        const done = projectId === '1' ? 3 : 1
        return { total, done }
    }

    // Footprints
    getResourceFootprints(dateStr: string): ResourceFootprint[] {
        const footprints: ResourceFootprint[] = []

        // 1. Inbox Resources (using timestamp as creation/action time)
        INITIAL_INBOX_RESOURCES.forEach(r => {
            if (format(r.timestamp, 'yyyy-MM-dd') === dateStr) {
                footprints.push({
                    id: r.id,
                    title: r.title,
                    type: r.type,
                    action: 'created', // Simplify for mock
                    timestamp: r.timestamp,
                    summary: r.summary
                })
            }
        })

        // 2. Project Resources
        INITIAL_PROJECT_RESOURCES.forEach(r => {
            if (format(r.createdAt, 'yyyy-MM-dd') === dateStr) {
                footprints.push({
                    id: r.id,
                    title: r.title,
                    type: r.type,
                    action: 'created',
                    timestamp: r.createdAt,
                    summary: r.content.substring(0, 100) + '...'
                })
            }
        })

        // 3. Journal Entry
        this.journalEntries.forEach(e => {
            // Check creation
            if (format(e.createdAt, 'yyyy-MM-dd') === dateStr) {
                footprints.push({
                    id: `journal-create-${e.date}`,
                    title: `Journal Entry (${e.date})`,
                    type: 'journal',
                    action: 'created',
                    timestamp: e.createdAt,
                    summary: e.content ? (e.content.substring(0, 60) + (e.content.length > 60 ? '...' : '')) : 'No content'
                })
            } else if (format(e.updatedAt, 'yyyy-MM-dd') === dateStr) {
                footprints.push({
                    id: `journal-update-${e.date}`,
                    title: `Journal Entry (${e.date})`,
                    type: 'journal',
                    action: 'modified',
                    timestamp: e.updatedAt,
                    summary: e.content ? (e.content.substring(0, 60) + (e.content.length > 60 ? '...' : '')) : 'No content'
                })
            }
        })

        return footprints.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }
}

export const dataStore = new DataStore()
