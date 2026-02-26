
import React, { useMemo, useState, useEffect } from "react"
import {
    LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDb } from "@/providers/DbProvider"
import { LogService } from "@/services"
import { format, subDays, parseISO } from "date-fns"
import { Task } from "@/types/models"

// --- Types & Constants ---

type TimeRange = "7d" | "30d"

// --- Components ---

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-bold text-primary">
                    {Number(payload[0].value).toLocaleString()} <span className="text-[10px] opacity-70 uppercase">{unit}</span>
                </p>
            </div>
        )
    }
    return null
}

export const MetricCharts: React.FC<{ tasks?: Task[] }> = ({ tasks = [] }) => {
    const [range, setRange] = useState<TimeRange>("7d")
    const db = useDb();

    const logService = useMemo(() => new LogService(db), [db]);



    // Note: Fetching ALL logs might be heavy later, but for now ok.
    // Ideally we subscribe to specific metrics' logs.
    // logService might not have getAll$() or it returns too much.
    // Let's assume we want specific metrics: 'weight', 'focus' (or 'mood'), 'sleep'.
    // We can try to find them by name or ID if seeded with known IDs.
    // DataSeeder uses IDs: 'mood', 'energy', 'sleep', 'focus'.

    // We need to fetch logs for these specific metrics.
    // Since we don't have a single observable for all relevant logs, we might need a custom hook or effect.
    // Or we simply use logService.getEntries(metricId) which returns Promise<Log[]>.

    const [weightLogs, setWeightLogs] = useState<any[]>([]);
    const [pomodoroLogs, setPomodoroLogs] = useState<any[]>([]);
    const [sleepLogs, setSleepLogs] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const daysMap = {
                "7d": 7,
                "30d": 30,
            };
            const days = daysMap[range];
            const sinceDate = subDays(new Date(), days).toISOString().split('T')[0];

            // Helper to process logs
            const processLogs = async (metricId: string) => {
                const logs = await logService.getEntries(metricId);
                return logs
                    .filter(l => l.date >= sinceDate)
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map(l => ({
                        date: l.date,
                        label: format(parseISO(l.date), "MM/dd"),
                        value: Number(l.value)
                    }));
            };

            // 1. Weight or Energy
            const wLogs = await processLogs('energy');
            setWeightLogs(wLogs);

            // 2. Pomodoros (from Tasks)
            const pLogs = [];
            for (let i = days; i >= 0; i--) {
                const d = subDays(new Date(), i);
                const dateStr = format(d, 'yyyy-MM-dd');
                const dayTasks = tasks.filter(t =>
                    (t.status === 'done' || t.status === 'checked') &&
                    t.completedAt && t.completedAt.startsWith(dateStr)
                );
                const sum = dayTasks.reduce((acc, t) => acc + (t.tomatoes || 0), 0);
                pLogs.push({
                    date: dateStr,
                    label: format(d, 'MM/dd'),
                    value: sum
                });
            }
            setPomodoroLogs(pLogs);

            // 3. Sleep
            const sLogs = await processLogs('sleep');
            setSleepLogs(sLogs);
        };

        if (db) {
            loadData();
        }
    }, [db, range, logService, tasks]);


    return (
        <div className="space-y-6" data-testid="metric-charts">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-1.5 rounded-lg">📈</span>
                    趨勢分析
                </h2>
                <Tabs value={range} onValueChange={(v) => setRange(v as TimeRange)} className="w-auto">
                    <TabsList className="grid grid-cols-2 w-[160px] bg-muted/50">
                        <TabsTrigger value="7d" className="text-[10px] font-bold uppercase">7D</TabsTrigger>
                        <TabsTrigger value="30d" className="text-[10px] font-bold uppercase">30D</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Line Chart - Energy (substituted for Weight) */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between opacity-80">
                            <span>能量指數 (Energy)</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 bg-primary/10 text-primary rounded-full">1-5</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        {weightLogs.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightLogs}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="label"
                                        fontSize={10}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide domain={[1, 5]} />
                                    <Tooltip content={<CustomTooltip unit="" />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={{ r: 0 }}
                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                        animationDuration={1000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs">暫無數據</div>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Area Chart - Pomodoros */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between opacity-80">
                            <span>產能 (Pomodoro)</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 bg-red-500/10 text-red-600 rounded-full">TOMATOES</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        {pomodoroLogs.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={pomodoroLogs}>
                                    <defs>
                                        <linearGradient id="colorPomodoro" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="label"
                                        fontSize={10}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide domain={[0, 'auto']} />
                                    <Tooltip content={<CustomTooltip unit="🍅" />} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#ef4444"
                                        fillOpacity={1}
                                        fill="url(#colorPomodoro)"
                                        strokeWidth={3}
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs">暫無數據</div>
                        )}
                    </CardContent>
                </Card>

                {/* 3. Scatter/Dot Plot - Sleep */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden md:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between opacity-80">
                            <span>睡眠時長 (Time)</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full">HOURS</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        {sleepLogs.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="label"
                                        name="date"
                                        fontSize={10}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis type="number" dataKey="value" name="hours" hide domain={[0, 12]} />
                                    <ZAxis range={[60, 60]} />
                                    <Tooltip content={<CustomTooltip unit="hrs" />} />
                                    <Scatter
                                        data={sleepLogs}
                                        fill="hsl(var(--primary))"
                                        animationDuration={1000}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs">暫無數據</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
