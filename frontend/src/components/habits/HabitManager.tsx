import React from 'react'
import { Habit, HABITS } from '@/services/mock-data-service'
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

interface HabitManagerProps {
    areaId: string
}

export const HabitManager: React.FC<HabitManagerProps> = ({ areaId }) => {
    const [habits, setHabits] = React.useState<Habit[]>(
        HABITS.filter(h => h.areaId === areaId)
    )
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null)

    const handleToggleStatus = (habitId: string) => {
        setHabits(prev => prev.map(h =>
            h.id === habitId ? { ...h, status: h.status === 'active' ? 'paused' : 'active' } : h
        ))
    }

    const handleCreateHabit = (data: { name: string; frequency: 'daily' | 'weekly'; days?: number[] }) => {
        const newHabit: Habit = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name,
            currentStreak: 0,
            maxStreak: 0,
            status: 'active',
            frequency: data.frequency,
            days: data.days,
            areaId
        }
        setHabits([...habits, newHabit])
        toast.success(`習慣「${data.name}」已建立`)
    }

    const handleEditHabit = (data: { name: string; frequency: 'daily' | 'weekly'; days?: number[] }) => {
        if (!editingHabit) return
        setHabits(prev => prev.map(h =>
            h.id === editingHabit.id ? { ...h, ...data } : h
        ))
        toast.success(`習慣「${data.name}」已更新`)
    }

    const handleDeleteHabit = (habitId: string) => {
        setHabits(prev => prev.filter(h => h.id !== habitId))
        toast.info('習慣已移除')
    }

    const getFrequencyLabel = (habit: Habit) => {
        if (habit.frequency === 'daily') return '每日'
        if (habit.frequency === 'weekly' && habit.days) {
            const dayMap: Record<number, string> = { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' }
            return `每週 (${habit.days.map(d => dayMap[d]).join(', ')})`
        }
        return '每週'
    }

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
                    habits.map(habit => (
                        <div
                            key={habit.id}
                            className={`flex items-center justify-between p-4 bg-card rounded-xl border transition-all hover:shadow-sm ${habit.status === 'paused' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${habit.status === 'paused' ? 'bg-muted' : 'bg-primary/10'}`}>
                                    <Calendar className={`w-5 h-5 ${habit.status === 'paused' ? 'text-muted-foreground' : 'text-primary'}`} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{habit.name}</span>
                                        <Badge variant="outline" className="text-[10px] px-1.5 h-4 border-muted-foreground/30">
                                            {getFrequencyLabel(habit)}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        目前連勝：{habit.currentStreak} 天 | 最高紀錄：{habit.maxStreak} 天
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 mr-2">
                                    <span className="text-xs text-muted-foreground">{habit.status === 'active' ? '進行中' : '已暫停'}</span>
                                    <Switch
                                        checked={habit.status === 'active'}
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
                    ))
                )}
            </div>

            <CreateHabitModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateHabit}
                title="建立新習慣"
            />

            <CreateHabitModal
                isOpen={!!editingHabit}
                onClose={() => setEditingHabit(null)}
                onSubmit={handleEditHabit}
                initialData={editingHabit || undefined}
                title="編輯習慣"
            />
        </div>
    )
}
