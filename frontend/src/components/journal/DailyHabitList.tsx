import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Habit, dataStore } from '@/services/mock-data-service'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'

interface DailyHabitListProps {
    date: Date
    readOnly?: boolean
}

export const DailyHabitList: React.FC<DailyHabitListProps> = ({ date, readOnly }) => {
    const [habits, setHabits] = useState<Habit[]>([])
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayOfWeek = date.getDay() // 0-6 Sun-Sat

    useEffect(() => {
        const loadHabits = () => {
            const allHabits = dataStore.getAllHabits()
            const activeHabits = allHabits.filter(h => h.status === 'active')

            const todaysHabits = activeHabits.filter(h => {
                if (h.frequency === 'daily') return true
                if (h.frequency === 'weekly' && h.days?.includes(dayOfWeek)) return true
                return false
            })

            // Sort by completion status (incomplete first) then name
            todaysHabits.sort((a, b) => {
                const aCompleted = a.completedDates?.includes(dateStr)
                const bCompleted = b.completedDates?.includes(dateStr)
                if (aCompleted === bCompleted) return a.name.localeCompare(b.name)
                return aCompleted ? 1 : -1
            })

            setHabits(todaysHabits)
        }

        loadHabits()
        // Listen to dataStore changes? Assuming simple re-render on parent update or local state mgmt for now.
        // In a real app we'd sub to store. For now, we'll force update on toggle.
    }, [date, dayOfWeek, dateStr])

    const handleToggle = (habitId: string) => {
        if (readOnly) return
        dataStore.toggleHabitCompletion(habitId, dateStr)
        // Reload habits to reflect changes
        const allHabits = dataStore.getAllHabits()
        const activeHabits = allHabits.filter(h => h.status === 'active')
        const todaysHabits = activeHabits.filter(h => {
            if (h.frequency === 'daily') return true
            if (h.frequency === 'weekly' && h.days?.includes(dayOfWeek)) return true
            return false
        })
        todaysHabits.sort((a, b) => {
            const aCompleted = a.completedDates?.includes(dateStr)
            const bCompleted = b.completedDates?.includes(dateStr)
            if (aCompleted === bCompleted) return a.name.localeCompare(b.name)
            return aCompleted ? 1 : -1
        })
        setHabits(todaysHabits)
    }

    if (habits.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground text-sm">
                今天沒有排定的習慣
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {habits.map(habit => {
                const isCompleted = habit.completedDates?.includes(dateStr)
                return (
                    <div
                        key={habit.id}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-all",
                            isCompleted ? "bg-muted/50 border-transparent" : "bg-card hover:border-primary/50",
                            readOnly && "opacity-70"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                animate={{ scale: isCompleted ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Checkbox
                                    id={`habit-${habit.id}`}
                                    checked={isCompleted}
                                    onCheckedChange={() => handleToggle(habit.id)}
                                    disabled={readOnly}
                                />
                            </motion.div>
                            <label
                                htmlFor={`habit-${habit.id}`}
                                className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                    isCompleted && "line-through text-muted-foreground",
                                    readOnly && "cursor-default"
                                )}
                            >
                                {habit.name}
                            </label>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Current Streak">
                            <Flame className={cn("w-3.5 h-3.5", habit.currentStreak > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
                            <span>{habit.currentStreak}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
