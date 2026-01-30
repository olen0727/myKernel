import React, { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreVertical, Pencil, Trash2, Calendar } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateHabitModal } from './CreateHabitModal'
import { toast } from 'sonner'
import { services, HabitService } from '@/services'
import { useObservable } from '@/hooks/use-observable'
import { Habit } from '@/types/models'

interface HabitManagerProps {
    areaId: string
}

export const HabitManager: React.FC<HabitManagerProps> = ({ areaId }) => {
    const [habitService, setHabitService] = useState<HabitService | undefined>();
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null)

    useEffect(() => {
        const load = async () => {
            setHabitService(await services.habit);
        };
        load();
    }, []);

    const allHabits$ = useMemo(() => habitService?.getAll$(), [habitService]);
    const allHabits = useObservable<Habit[]>(allHabits$, []) || [];

    const habits = useMemo(() => {
        // Filter by areaId. Assuming Habit model has areaId.
        // It was used in mock-data-service, so should be safe.
        return allHabits.filter(h => (h as any).areaId === areaId);
    }, [allHabits, areaId]);

    const handleToggleStatus = async (habitId: string) => {
        if (!habitService) return;
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        // Assuming 'status' is not yet in formal model interface but was in logic.
        // Let's assume we can cast or it will be added.
        const currentStatus = (habit as any).status || 'active';
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';

        try {
            await habitService.update(habitId, { status: newStatus } as any);
        } catch (e) {
            toast.error("更新失敗");
        }
    }

    const handleHabitSubmit = async (data: { name: string; frequency: 'daily' | 'weekly'; days?: number[] }) => {
        if (!habitService) return;
        try {
            if (editingHabit) {
                await habitService.update(editingHabit.id, {
                    name: data.name,
                    frequency: data.frequency,
                    days: data.days
                } as any);
                toast.success(`習慣「${data.name}」已更新`)
                setEditingHabit(null)
            } else {
                await habitService.create({
                    name: data.name,
                    frequency: data.frequency,
                    days: data.days,
                    areaId: areaId,
                    completedDates: [],
                    status: 'active',
                    currentStreak: 0,
                    maxStreak: 0
                } as any);
                toast.success(`習慣「${data.name}」已建立`)
                setIsCreateModalOpen(false)
            }
        } catch (e) {
            toast.error("儲存失敗");
        }
    }

    const handleDeleteHabit = async (habitId: string) => {
        if (!habitService) return;
        try {
            await habitService.delete(habitId);
            toast.info('習慣已移除')
        } catch (e) {
            toast.error("刪除失敗");
        }
    }

    const getFrequencyLabel = (habit: Habit) => {
        if (habit.frequency === 'daily') return '每日'
        const days = (habit as any).days;
        if (habit.frequency === 'weekly' && days) {
            const dayMap: Record<number, string> = { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' }
            return `每週 (${days.map((d: number) => dayMap[d]).join(', ')})`
        }
        return '每週'
    }

    if (!habitService) return <div>Loading Habits...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">習慣管理</h3>
                <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    新增習慣
                </Button>
            </div>

            <div className="grid gap-3">
                {habits.length === 0 ? (
                    <div className="text-center py-12 bg-accent/20 rounded-xl border border-dashed border-border text-muted-foreground">
                        目前此領域尚無設定習慣
                    </div>
                ) : (
                    habits.map(habit => {
                        const status = (habit as any).status || 'active';
                        return (
                            <div
                                key={habit.id}
                                className={`flex items-center justify-between p-4 bg-card rounded-xl border transition-all hover:shadow-sm ${status === 'paused' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${status === 'paused' ? 'bg-muted' : 'bg-primary/10'}`}>
                                        <Calendar className={`w-5 h-5 ${status === 'paused' ? 'text-muted-foreground' : 'text-primary'}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{habit.name}</span>
                                            <Badge variant="outline" className="text-[10px] px-1.5 h-4 border-muted-foreground/30">
                                                {getFrequencyLabel(habit)}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            目前連勝：{habit.currentStreak || 0} 天 | 最高紀錄：{habit.maxStreak || 0} 天
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 mr-2">
                                        <span className="text-xs text-muted-foreground">{status === 'active' ? '進行中' : '已暫停'}</span>
                                        <Switch
                                            checked={status === 'active'}
                                            onCheckedChange={() => handleToggleStatus(habit.id)}
                                        />
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2" onClick={() => setEditingHabit(habit)}>
                                                <Pencil className="w-4 h-4" /> 編輯習慣
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="gap-2 text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteHabit(habit.id)}
                                            >
                                                <Trash2 className="w-4 h-4" /> 刪除
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            <CreateHabitModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleHabitSubmit}
                title="建立新習慣"
            />

            <CreateHabitModal
                isOpen={!!editingHabit}
                onClose={() => setEditingHabit(null)}
                onSubmit={handleHabitSubmit}
                initialData={editingHabit as any || undefined}
                title="編輯習慣"
            />
        </div>
    )
}
