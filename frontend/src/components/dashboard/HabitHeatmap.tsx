import React, { useMemo } from "react"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Mock Data
const HABITS = [
    { id: "1", name: "寫日記", streak: 42 },
    { id: "2", name: "閱讀 30 分鐘", streak: 5 },
    { id: "3", name: "冥想", streak: 12 },
    { id: "4", name: "運動", streak: 3 },
]

// 模擬過去 30 天的數據
const generateMockData = () => {
    const end = new Date()
    const start = subDays(end, 29)
    const days = eachDayOfInterval({ start, end })

    return HABITS.map(habit => ({
        ...habit,
        data: days.map(day => ({
            date: day,
            completed: Math.random() > 0.3 // 模擬 70% 的達成率
        }))
    }))
}

export const HabitHeatmap: React.FC = () => {
    const habitData = useMemo(() => generateMockData(), [])

    return (
        <Card data-testid="habit-heatmap">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    習慣追蹤 (最近 30 天)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {habitData.map(habit => (
                        <div key={habit.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{habit.name}</span>
                                <span className="text-orange-500 font-bold">🔥 {habit.streak} days</span>
                            </div>

                            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
                                {habit.data.map((day, idx) => (
                                    <div
                                        key={idx}
                                        title={`${format(day.date, "yyyy-MM-dd")}: ${habit.name} ${day.completed ? "已達成" : "未達成"}`}
                                        className={`w-3 h-3 rounded-sm flex-shrink-0 transition-colors ${day.completed
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-muted hover:bg-muted-foreground/30"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
