import React, { useMemo } from "react"
import { format, subWeeks, startOfWeek, eachDayOfInterval, addDays, getWeek } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock Data
const HABITS = [
    { id: "1", name: "寫日記", currentStreak: 42, maxStreak: 60 },
    { id: "2", name: "閱讀 30 分鐘", currentStreak: 5, maxStreak: 15 },
    { id: "3", name: "冥想", currentStreak: 12, maxStreak: 12 },
    { id: "4", name: "運動", currentStreak: 3, maxStreak: 10 },
]

/**
 * 產生最近 7 週的數據，按週分組
 */
const generateWeeklyMockData = () => {
    const end = new Date()
    // 取得 6 週前的週初
    const start = startOfWeek(subWeeks(end, 6))

    return HABITS.map(habit => {
        const weeks = []
        for (let i = 0; i < 7; i++) {
            const weekStart = addDays(start, i * 7)
            const days = eachDayOfInterval({
                start: weekStart,
                end: addDays(weekStart, 6)
            }).map(day => ({
                date: day,
                completed: Math.random() > 0.4
            }))

            weeks.push({
                weekNum: getWeek(weekStart),
                days,
                completedCount: days.filter(d => d.completed).length
            })
        }
        return { ...habit, weeks }
    })
}

const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted hover:bg-muted-foreground/20"
    if (count <= 2) return "bg-green-100 dark:bg-green-900/30 hover:bg-green-200"
    if (count <= 4) return "bg-green-300 dark:bg-green-700/50 hover:bg-green-400"
    if (count <= 6) return "bg-green-500 hover:bg-green-600"
    return "bg-green-700 hover:bg-green-800"
}

export const HabitHeatmap: React.FC = () => {
    const habitData = useMemo(() => generateWeeklyMockData(), [])
    // 取得 X 軸週號標籤 (取第一項習慣的週資料即可)
    const weekLabels = habitData[0]?.weeks.map(w => `w${w.weekNum}`) || []

    return (
        <Card data-testid="habit-heatmap">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    <span>習慣追蹤 (最近 7 週)</span>
                    <div className="flex items-center gap-4 text-xs font-normal text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-sm bg-muted" /> 0
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-sm bg-green-700" /> 7
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {habitData.map(habit => (
                        <div key={habit.id} className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-foreground/80">{habit.name}</span>
                                <div className="flex gap-3 items-center">
                                    <span className="text-orange-500 font-bold flex items-center gap-1">
                                        🔥 {habit.currentStreak}
                                    </span>
                                    <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-full">
                                        Max {habit.maxStreak}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex gap-3">
                                    {habit.weeks.map((week, wIdx) => (
                                        <div
                                            key={wIdx}
                                            className="flex-1 group cursor-help relative"
                                            title={`Week ${week.weekNum} (${week.completedCount}/7)\n${week.days.map(d => `${format(d.date, "MM/dd")}: ${d.completed ? "✓" : "✗"}`).join("\n")}`}
                                        >
                                            <div className={cn(
                                                "h-10 rounded-md transition-all duration-200 border border-border/10",
                                                getIntensityClass(week.completedCount)
                                            )} />
                                        </div>
                                    ))}
                                </div>
                                {/* X-axis week numbers */}
                                <div className="flex text-[10px] text-muted-foreground font-mono">
                                    {weekLabels.map((label, lIdx) => (
                                        <div key={lIdx} className="flex-1 text-center">
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
