
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, parse, isValid, startOfDay, isAfter } from "date-fns"
import { DateNavigator } from "@/components/journal/DateNavigator"
import { DailyHabitList } from "@/components/journal/DailyHabitList"
import { MetricInputList } from "@/components/journal/MetricInputList"
import { cn } from "@/lib/utils"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { dataStore } from "@/services/mock-data-service"
import { useDebounce } from "@/hooks/use-debounce"
import { useState } from "react"

export default function JournalPage() {
    const { date } = useParams()
    const navigate = useNavigate()

    // Parse date safely directly
    const currentDate = date ? parse(date, "yyyy-MM-dd", new Date()) : new Date()
    const isValidDate = date ? isValid(currentDate) : false
    const dateStr = isValidDate ? format(currentDate, "yyyy-MM-dd") : ""

    const [content, setContent] = useState("")
    const [isLoaded, setIsLoaded] = useState(false)
    const debouncedContent = useDebounce(content, 1000)

    // Load content on date change
    useEffect(() => {
        if (!dateStr) return
        const entry = dataStore.getJournalEntry(dateStr)
        setContent(entry?.content || "")
        setIsLoaded(true)
    }, [dateStr])

    // Save content on debounce
    useEffect(() => {
        if (!isLoaded || !dateStr) return
        // Prevent saving empty string if it's just initial load? 
        // No, user might clear content.
        // Prevent saving if content matches store? (Optional optimization)

        dataStore.saveJournalEntry(dateStr, debouncedContent)
    }, [debouncedContent, dateStr, isLoaded])

    useEffect(() => {
        if (!date) {
            const today = format(new Date(), "yyyy-MM-dd")
            navigate(`/journal/${today}`, { replace: true })
            return
        }

        if (!isValidDate) {
            const today = format(new Date(), "yyyy-MM-dd")
            navigate(`/journal/${today}`, { replace: true })
        }
    }, [date, isValidDate, navigate])

    const handleDateChange = (newDate: Date) => {
        const dateStr = format(newDate, "yyyy-MM-dd")
        navigate(`/journal/${dateStr}`)
    }

    if (!date || !isValidDate) return null

    const isFutureDay = isAfter(startOfDay(currentDate), startOfDay(new Date()))

    return (
        <div className="flex flex-col h-full bg-background" data-testid="journal-page">
            {/* Header / Date Navigator */}
            <div className="border-b px-6 py-3 flex items-center justify-between bg-card text-card-foreground">
                <DateNavigator
                    currentDate={currentDate}
                    onDateChange={handleDateChange}
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                    {/* Left 60% -> 3/5 cols */}
                    <div className="lg:col-span-3 border-r overflow-y-auto p-6 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Daily Note</h2>
                            <div className="border rounded-lg bg-card min-h-[500px]">
                                <TipTapEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">Resource Footprints</h2>
                            <div className="p-4 border rounded-lg bg-muted/20 h-32 flex items-center justify-center text-muted-foreground">
                                Footprints Placeholder
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right 40% -> 2/5 cols */}
                <div className="lg:col-span-2 overflow-y-auto p-6 space-y-6 bg-muted/10">
                    <div
                        className={cn("space-y-4", isFutureDay && "opacity-50 pointer-events-none")}
                        aria-disabled={isFutureDay}
                    >
                        <h2 className="text-xl font-semibold tracking-tight">Habits</h2>
                        <DailyHabitList date={currentDate} readOnly={isFutureDay} />
                    </div>

                    <div
                        className={cn("space-y-4", isFutureDay && "opacity-50 pointer-events-none")}
                        aria-disabled={isFutureDay}
                    >
                        <h2 className="text-xl font-semibold tracking-tight">Metrics</h2>
                        <MetricInputList date={currentDate} readOnly={isFutureDay} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold tracking-tight">Action Guide</h2>
                        <div className="p-4 border rounded-lg bg-background h-32 flex items-center justify-center text-muted-foreground">
                            Action Guide Placeholder
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
