import React, { useState, useEffect } from 'react'
import { MetricDefinition } from '@/services/mock-data-service'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Star, Moon, Zap, Target } from 'lucide-react'

interface MetricItemProps {
    definition: MetricDefinition
    value: number | undefined
    onChange: (value: number) => void
    readOnly?: boolean
}

export const MetricItem: React.FC<MetricItemProps> = ({ definition, value, onChange, readOnly }) => {
    const [localValue, setLocalValue] = useState<string | number>('')
    const [error, setError] = useState(false)

    useEffect(() => {
        setLocalValue(value ?? '')
        setError(false)
    }, [value])

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value)
        setError(false)
    }

    const handleBlur = () => {
        if (readOnly) return
        if (localValue === '') {
            // allowing empty? If so, maybe 0 or undefined.
            // If empty string, treat as undefined/clear
            // onChange(undefined) // If we want to support clearing number inputs
            return
        }
        const num = parseFloat(localValue.toString())
        if (!isNaN(num)) {
            // Validation
            if (definition.min !== undefined && num < definition.min) {
                setError(true)
                return
            }
            if (definition.max !== undefined && num > definition.max) {
                setError(true)
                return
            }
            onChange(num)
        } else {
            setError(true)
        }
    }

    const handleRatingClick = (rating: number) => {
        if (readOnly) return
        if (value === rating) {
            // Toggle off (clear) - passing 0 or handling undefined if supported.
            // Since props expects number, let's assume 0 is clear for rating
            onChange(0)
        } else {
            onChange(rating)
        }
    }

    const getIcon = () => {
        switch (definition.id) {
            case 'mood': return <Star className="w-4 h-4" />
            case 'energy': return <Zap className="w-4 h-4" />
            case 'sleep': return <Moon className="w-4 h-4" />
            case 'focus': return <Target className="w-4 h-4" />
            default: return null
        }
    }

    return (
        <div className={cn(
            "flex flex-col gap-2 p-3 bg-card rounded-lg border transition-colors",
            !readOnly && "hover:border-primary/50",
            readOnly && "opacity-70",
            error && "border-destructive hover:border-destructive"
        )}>
            <Label className={cn("flex items-center gap-2 mb-1", error ? "text-destructive" : "text-muted-foreground")}>
                {getIcon()}
                {definition.name}
            </Label>

            {definition.type === 'number' ? (
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        value={localValue}
                        onChange={handleNumberChange}
                        onBlur={handleBlur}
                        className={cn("h-9", error && "border-destructive focus-visible:ring-destructive")}
                        min={definition.min}
                        max={definition.max}
                        step={definition.step}
                        disabled={readOnly}
                    />
                    {definition.unit && <span className="text-xs text-muted-foreground">{definition.unit}</span>}
                </div>
            ) : (
                <div className="flex flex-wrap gap-1">
                    {Array.from({ length: (definition.max || 5) }, (_, i) => i + 1).map((rating) => (
                        <Button
                            key={rating}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 w-8 p-0 rounded-full hover:bg-transparent",
                                (value || 0) >= rating ? "text-yellow-500" : "text-muted-foreground/30",
                                readOnly && "cursor-default hover:text-yellow-500"
                            )}
                            onClick={() => handleRatingClick(rating)}
                            disabled={readOnly}
                        >
                            <Star className={cn("w-6 h-6", (value || 0) >= rating && "fill-current")} />
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}
