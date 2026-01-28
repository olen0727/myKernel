import React, { useState, useEffect } from 'react'
import { differenceInMinutes, set, subDays } from 'date-fns'
import { Input } from '@/components/ui/input' // Unused but let's keep or remove. Wait, I removed Input usage.
import { Label } from '@/components/ui/label'
import { Moon, Sun, Clock, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SleepTrackerProps {
    date: Date
    readOnly?: boolean
    initialSleepTime?: string
    initialWakeTime?: string
    title?: string
    onDataChange?: (durationMinutes: number | undefined, sleepTime: string, wakeTime: string) => void
}

// Helper Component for 24h Time Selection
const TimePicker: React.FC<{
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}> = ({ value, onChange, disabled }) => {
    const [hour, minute] = value ? value.split(':') : ['', '']

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

    const handleHourChange = (newHour: string) => {
        onChange(`${newHour}:${minute || '00'}`)
    }

    const handleMinuteChange = (newMinute: string) => {
        onChange(`${hour || '00'}:${newMinute}`)
    }

    const handleClear = () => {
        onChange('')
    }

    return (
        <div className="flex items-center gap-1">
            <Select value={hour} onValueChange={handleHourChange} disabled={disabled}>
                <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                    {hours.map(h => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <span className="text-muted-foreground">:</span>
            <Select value={minute} onValueChange={handleMinuteChange} disabled={disabled}>
                <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                    {minutes.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {value && !disabled && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-1 text-muted-foreground hover:text-foreground"
                    onClick={handleClear}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({
    date,
    readOnly,
    initialSleepTime,
    initialWakeTime,
    title,
    onDataChange
}) => {
    const [sleepTime, setSleepTime] = useState<string>(initialSleepTime || '')
    const [wakeTime, setWakeTime] = useState<string>(initialWakeTime || '')
    const [duration, setDuration] = useState<string | null>(null)

    // Use a ref for onDataChange to avoid adding it to the dependency array of calculateDuration
    // This prevents infinite loops when the parent component recreates the callback on every render
    const onDataChangeRef = React.useRef(onDataChange)

    useEffect(() => {
        onDataChangeRef.current = onDataChange
    }, [onDataChange])

    const calculateDuration = React.useCallback(() => {
        if (!sleepTime || !wakeTime) {
            setDuration(null)
            if (sleepTime === '' || wakeTime === '') {
                onDataChangeRef.current?.(undefined, sleepTime, wakeTime)
            }
            return
        }

        const [sleepH, sleepM] = sleepTime.split(':').map(Number)
        const [wakeH, wakeM] = wakeTime.split(':').map(Number)

        let sleepDate = set(date, { hours: sleepH, minutes: sleepM, seconds: 0 })
        const wakeDate = set(date, { hours: wakeH, minutes: wakeM, seconds: 0 })

        if (sleepDate > wakeDate) {
            sleepDate = subDays(sleepDate, 1)
        }

        const diffMinutes = differenceInMinutes(wakeDate, sleepDate)

        if (diffMinutes >= 0) {
            const hrs = Math.floor(diffMinutes / 60)
            const mins = diffMinutes % 60
            setDuration(`${hrs} hrs ${mins} mins`)
            onDataChangeRef.current?.(diffMinutes, sleepTime, wakeTime)
        } else {
            setDuration('Invalid range')
            onDataChangeRef.current?.(undefined, sleepTime, wakeTime)
        }
    }, [sleepTime, wakeTime, date])

    useEffect(() => {
        calculateDuration()
    }, [calculateDuration])

    return (
        <div className="p-4 bg-card rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <Moon className="w-5 h-5" />
                <h3 className="font-medium">{title || "Sleep Tracker"}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="sleep-at-picker" className="text-xs text-muted-foreground flex items-center gap-1">
                        <Moon className="w-3 h-3" />
                        Sleep At
                    </Label>
                    <div id="sleep-at-picker">
                        <TimePicker
                            value={sleepTime}
                            onChange={setSleepTime}
                            disabled={readOnly}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="wake-up-picker" className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sun className="w-3 h-3" />
                        Wake Up At
                    </Label>
                    <div id="wake-up-picker">
                        <TimePicker
                            value={wakeTime}
                            onChange={setWakeTime}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>

            {duration && (
                <div className="mt-4 flex items-center gap-2 p-2 bg-secondary/50 rounded text-sm text-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{duration}</span>
                </div>
            )}
        </div>
    )
}
