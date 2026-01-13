import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface CreateHabitModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (habit: { name: string; frequency: 'daily' | 'weekly'; days?: number[] }) => void
    initialData?: { name: string; frequency: 'daily' | 'weekly'; days?: number[] }
    title?: string
}

const DAYS = [
    { label: '日', value: 0 },
    { label: '一', value: 1 },
    { label: '二', value: 2 },
    { label: '三', value: 3 },
    { label: '四', value: 4 },
    { label: '五', value: 5 },
    { label: '六', value: 6 },
]

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title = '建立新習慣'
}) => {
    const [name, setName] = React.useState('')
    const [frequency, setFrequency] = React.useState<'daily' | 'weekly'>('daily')
    const [selectedDays, setSelectedDays] = React.useState<number[]>([])

    // Sync state with initialData when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '')
            setFrequency(initialData?.frequency || 'daily')
            setSelectedDays(initialData?.days || [])
        }
    }, [isOpen, initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onSubmit({
                name,
                frequency,
                days: frequency === 'weekly' ? selectedDays : undefined
            })
            if (!initialData) {
                setName('')
                setFrequency('daily')
                setSelectedDays([])
            }
            onClose()
        }
    }

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            設定一個新的習慣行為，持之以恆以達成目標。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="habit-name">習慣名稱</Label>
                            <Input
                                id="habit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="例如：早起喝水、深蹲 30 下..."
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="frequency">執行頻率</Label>
                            <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                                <SelectTrigger id="frequency">
                                    <SelectValue placeholder="選擇頻率" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">每天 (Daily)</SelectItem>
                                    <SelectItem value="weekly">每週 (Weekly)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {frequency === 'weekly' && (
                            <div className="grid gap-2">
                                <Label>重複日期</Label>
                                <div className="flex flex-wrap gap-3 pt-1">
                                    {DAYS.map((day) => (
                                        <div key={day.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`day-${day.value}`}
                                                checked={selectedDays.includes(day.value)}
                                                onCheckedChange={() => toggleDay(day.value)}
                                            />
                                            <label
                                                htmlFor={`day-${day.value}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {day.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>取消</Button>
                        <Button type="submit">建立習慣</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
