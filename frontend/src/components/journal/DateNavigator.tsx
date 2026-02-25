
import { useEffect, useState } from "react"
import { format, addDays, subDays } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateNavigatorProps {
    currentDate: Date
    onDateChange: (date: Date) => void
    className?: string
}

export function DateNavigator({ currentDate, onDateChange, className }: DateNavigatorProps) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Avoid triggering when user is typing in an input, textarea, or contentEditable element
            const target = e.target as HTMLElement
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return
            }

            if (e.metaKey || e.ctrlKey) {
                if (e.key === "[") {
                    e.preventDefault()
                    onDateChange(subDays(currentDate, 1))
                } else if (e.key === "]") {
                    e.preventDefault()
                    onDateChange(addDays(currentDate, 1))
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [currentDate, onDateChange])

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDateChange(subDays(currentDate, 1))}
                aria-label="Previous day"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !currentDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentDate ? format(currentDate, "yyyy-MM-dd") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={(date) => {
                            if (date) {
                                onDateChange(date)
                                setIsCalendarOpen(false)
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDateChange(addDays(currentDate, 1))}
                aria-label="Next day"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateChange(new Date())}
            >
                Today
            </Button>
        </div>
    )
}
