import React, { useMemo, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { services, HabitService } from '@/services'
import { useObservable } from '@/hooks/use-observable'
import { Habit } from '@/types/models'

interface DailyHabitListProps {
    date: Date
    readOnly?: boolean
}

export const DailyHabitList: React.FC<DailyHabitListProps> = ({ date, readOnly }) => {
    const [habitService, setHabitService] = useState<HabitService | undefined>();

    useEffect(() => {
        const load = async () => {
            setHabitService(await services.habit);
        };
        load();
    }, []);

    const allHabits$ = useMemo(() => habitService?.getAll$(), [habitService]);
    const allHabits = useObservable<Habit[]>(allHabits$, []) || [];

    const dateStr = format(date, 'yyyy-MM-dd')
    const dayOfWeek = date.getDay() // 0-6 Sun-Sat

    const habits = useMemo(() => {
        // Filter habits relevant for today
        // Assuming Habit model has days array for weekly
        const filtered = allHabits.filter(h => {
            // For now assume active if no status field in interface, or check if interface updated
            // Model interface: Habit { name, frequency, completedDates, ... } No status?
            // Assuming all habits are active.
            if (h.frequency === 'daily') return true;
            // Weekly logic if 'days' exists (it's not in the strict interface I saw in models.ts but implied by mock-data usages)
            // The Interface I read in models.ts:
            // export interface Habit extends BaseModel { name: string; frequency: HabitFrequency; completedDates: string[]; ... }
            // Missing 'days'?
            // mock-data-service usage: h.frequency === 'weekly' && h.days?.includes(...)
            // I should cast or assume property exists for now.
            if (h.frequency === 'weekly' && (h as any).days?.includes(dayOfWeek)) return true;
            return false;
        });

        // Sort by completion
        return filtered.sort((a, b) => {
            const aCompleted = a.completedDates?.includes(dateStr)
            const bCompleted = b.completedDates?.includes(dateStr)
            if (aCompleted === bCompleted) return a.name.localeCompare(b.name)
            return aCompleted ? 1 : -1
        });
    }, [allHabits, dateStr, dayOfWeek]);

    const calculateStreak = (dates: string[], frequency: 'daily' | 'weekly', _days?: number[]): number => {
        // Simple daily streak for now
        if (frequency !== 'daily') return 0;

        const sorted = [...dates].sort((a, b) => b.localeCompare(a)); // Descending
        if (sorted.length === 0) return 0;

        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

        // If most recent is not today or yesterday, streak is broken 
        // (unless we allow gaps, but strict daily streak means today or yesterday must be done)
        const last = sorted[0];
        if (last !== today && last !== yesterday) return 0;

        let streak = 0;
        let checkDate = new Date(last);

        for (const date of sorted) {
            if (date === format(checkDate, 'yyyy-MM-dd')) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break; // Gap found
            }
        }
        return streak;
    };

    const handleToggle = async (habit: Habit) => {
        if (readOnly || !habitService) return;

        const isCompleted = habit.completedDates?.includes(dateStr);
        let newDates = [...(habit.completedDates || [])];

        if (isCompleted) {
            newDates = newDates.filter(d => d !== dateStr);
        } else {
            newDates.push(dateStr);
        }

        const newStreak = calculateStreak(newDates, habit.frequency, (habit as any).days);
        const maxStreak = Math.max(habit.maxStreak || 0, newStreak);

        try {
            await habitService.update(habit.id, {
                completedDates: newDates,
                currentStreak: newStreak,
                maxStreak: maxStreak
            });
            // Observable updates UI
        } catch (e) {
            console.error("Failed to toggle habit", e);
        }
    }

    if (!habitService) return <div>Loading Habits...</div>;

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
                                    onCheckedChange={() => handleToggle(habit)}
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
                            <Flame className={cn("w-3.5 h-3.5", (habit.currentStreak || 0) > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
                            <span>{habit.currentStreak || 0}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
