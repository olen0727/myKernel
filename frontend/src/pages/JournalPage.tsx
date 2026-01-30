
import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, parse, isValid, startOfDay, isAfter } from "date-fns"
import { DateNavigator } from "@/components/journal/DateNavigator"
import { DailyHabitList } from "@/components/journal/DailyHabitList"
import { MetricInputList } from "@/components/journal/MetricInputList"
import { FootprintList } from "@/components/journal/FootprintList"
import { cn } from "@/lib/utils"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { useDebounce } from "@/hooks/use-debounce"
import { services, LogService } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { Log } from "@/types/models"

export default function JournalPage() {
    const { date } = useParams()
    const navigate = useNavigate()

    // Parse date safely directly
    const currentDate = date ? parse(date, "yyyy-MM-dd", new Date()) : new Date()
    const isValidDate = date ? isValid(currentDate) : false
    const dateStr = isValidDate ? format(currentDate, "yyyy-MM-dd") : ""

    const [content, setContent] = useState("")
    // const [isLoaded, setIsLoaded] = useState(false) // Driven by useObservable now
    const debouncedContent = useDebounce(content, 1000)

    const [logService, setLogService] = useState<LogService | undefined>();

    useEffect(() => {
        const load = async () => {
            setLogService(await services.log);
        };
        load();
    }, []);

    const allLogs$ = useMemo(() => logService?.getAll$(), [logService]);
    const allLogs = useObservable<Log[]>(allLogs$, []) || [];

    const dailyNoteLog = useMemo(() => {
        return allLogs.find(l => l.date === dateStr && l.action === 'daily_note');
    }, [allLogs, dateStr]);

    // Load content when dailyNoteLog changes (or initially)
    // If we type, content state updates locally.
    // If dailyNoteLog updates remotely (e.g. sync), we might overwrite local changes?
    // For now, assume single user. Sync on mount/change of note ID.
    const [noteId, setNoteId] = useState<string | null>(null);

    useEffect(() => {
        if (dailyNoteLog) {
            // Only update content if we switched note (date change) or it's first load
            // To avoid cursor jumping or overwrite while typing if observable emits same data
            if (dailyNoteLog.id !== noteId) {
                setContent(dailyNoteLog.details || "");
                setNoteId(dailyNoteLog.id);
            }
        } else {
            // No note found for this date.
            if (noteId !== null) { // If we had a note before, and now none (deleted?) or changed date to empty day
                setContent("");
                setNoteId(null);
            }
            // If we just loaded and noteId is null, keep initialized empty content.
        }
    }, [dailyNoteLog, noteId]);

    // Save content on debounce
    useEffect(() => {
        if (!dateStr || !logService) return
        if (debouncedContent === (dailyNoteLog?.details || "")) return; // No change

        const save = async () => {
            if (dailyNoteLog) {
                await logService.update(dailyNoteLog.id, { details: debouncedContent });
            } else {
                if (debouncedContent) { // Only create if content exists
                    await logService.create({
                        date: dateStr,
                        action: 'daily_note',
                        details: debouncedContent,
                        timestamp: currentDate.getTime() // ensure timestamp is set if model requires it
                    } as any); // Cast if model strictness mismatch
                }
            }
        };
        save();
    }, [debouncedContent, dateStr, logService, dailyNoteLog, currentDate])


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
    if (!logService) return <div className="h-full flex items-center justify-center">Loading Journal...</div>

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
                            <FootprintList date={currentDate} />
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
        </div>
    )
}
