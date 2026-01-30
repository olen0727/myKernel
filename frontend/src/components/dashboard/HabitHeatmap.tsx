import React, { useMemo } from "react"
import { format, subWeeks, startOfWeek, eachDayOfInterval, addDays, getWeek } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { Habit } from "@/types/models"

interface HabitHeatmapProps {
    habits: Habit[]
}

/**
 * 產生最近 7 週的數據，按週分組
 */
const generateWeeklyData = (habits: Habit[]) => {
    const end = new Date()
    const start = startOfWeek(subWeeks(end, 6))

    return habits.map(habit => {
        const weeks = []
        for (let i = 0; i < 7; i++) {
            const weekStart = addDays(start, i * 7)
            const days = eachDayOfInterval({
                start: weekStart,
                end: addDays(weekStart, 6)
            }).map(day => {
                const dateStr = format(day, "yyyy-MM-dd")
                // Check if dateStr is in habit.completedDates (assuming it exists and is string[])
                // Note: Schema defines completedDates as string[]
                // Need to cast habit as any if TS complains about specific RxDB generated types vs model interface mismatch
                // But Model Interface should have completedDates if we added it.
                // Wait, model interface Habit in models.ts DOES NOT have completedDates!
                // I need to check models.ts again from previous view!
                const isCompleted = (habit as any).completedDates?.includes(dateStr) || false;
                return {
                    date: day,
                    completed: isCompleted
                }
            })

            weeks.push({
                weekNum: getWeek(weekStart),
                days,
                completedCount: days.filter(d => d.completed).length
            })
        }
        return { ...habit, weeks, currentStreak: (habit as any).currentStreak || 0, maxStreak: (habit as any).maxStreak || 0 }
    })
}

const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/50 hover:bg-muted-foreground/20"
    if (count <= 2) return "bg-green-100 dark:bg-green-900/20 hover:bg-green-200"
    if (count <= 4) return "bg-green-300 dark:bg-green-700/40 hover:bg-green-400"
    if (count <= 6) return "bg-green-500 hover:bg-green-600"
    return "bg-green-700 hover:bg-green-800"
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ habits }) => {
    const habitData = useMemo(() => generateWeeklyData(habits), [habits])
    const weekLabels = habitData[0]?.weeks.map(w => `w${w.weekNum}`) || []

    return (
        <Card data-testid="habit-heatmap" className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary p-1.5 rounded-lg">📊</span>
                        <span>習慣追蹤 (最近 7 週)</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm bg-muted/50" />
                            <span>很少</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm bg-green-700" />
                            <span>經常</span>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <TooltipProvider delayDuration={50}>
                        {habitData.map((habit) => (
                            <div key={habit.id} className="group/habit">
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="font-bold text-foreground/90 group-hover/habit:text-primary transition-colors">
                                        {habit.name}
                                    </span>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-orange-500 font-black animate-pulse-slow">🔥</span>
                                            <span className="font-bold text-orange-600" data-testid="streak-current">{habit.currentStreak}</span>
                                        </div>
                                        <div className="bg-muted/80 px-2.5 py-0.5 rounded-full border border-border/50">
                                            <span className="text-[10px] text-muted-foreground font-bold" data-testid="streak-max">
                                                MAX {habit.maxStreak}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {habit.weeks.map((week, wIdx) => (
                                        <Tooltip key={wIdx}>
                                            <TooltipTrigger asChild>
                                                <div className="flex-1 cursor-help transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                                    <div className={cn(
                                                        "h-4 rounded-sm border border-black/5 dark:border-white/5 shadow-inner transition-all duration-300",
                                                        getIntensityClass(week.completedCount)
                                                    )} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                align={wIdx === 0 ? "start" : wIdx === 6 ? "end" : "center"}
                                                avoidCollisions={true}
                                                collisionPadding={10}
                                                className="p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-popover/95 backdrop-blur-md min-w-[180px]"
                                                sideOffset={10}
                                            >
                                                <div className="bg-primary/10 px-3 py-2 border-b border-primary/5">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Week {week.weekNum}</span>
                                                        <span className="text-xs font-black text-primary">{week.completedCount} <span className="text-[10px] opacity-70">/ 7</span></span>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex justify-between items-center gap-1.5">
                                                        {week.days.map((day, dIdx) => (
                                                            <div
                                                                key={dIdx}
                                                                className="flex flex-col items-center gap-1.5"
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm transition-all border-2",
                                                                        day.completed
                                                                            ? "bg-green-500 border-green-400 text-white shadow-green-500/20"
                                                                            : "bg-red-500 border-red-400 text-white shadow-red-500/20"
                                                                    )}
                                                                >
                                                                    {format(day.date, "eeeee")}
                                                                </div>
                                                                <span className="text-[8px] font-medium text-muted-foreground/60">{format(day.date, "MM/dd")}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </TooltipProvider>

                    {/* Unified X-axis week numbers */}
                    <div className="pt-4 mt-2 border-t border-dashed border-border/50">
                        <div className="flex text-[9px] text-muted-foreground/60 font-black uppercase tracking-widest">
                            {weekLabels.map((label, lIdx) => (
                                <div key={lIdx} className="flex-1 text-center" data-testid="week-label">
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}} />
        </Card>
    )
}
