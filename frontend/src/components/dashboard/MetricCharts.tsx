
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

// --- Types & Constants ---

type TimeRange = "7d" | "30d" | "90d" | "1y"

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

export const MetricCharts: React.FC = () => {
    const [range, setRange] = useState<TimeRange>("30d")
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
    const [focusLogs, setFocusLogs] = useState<any[]>([]);
    const [sleepLogs, setSleepLogs] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            // Find metrics by ID (from DataSeeder)
            // Weight is NOT in DataSeeder defaults? Defaults: mood, energy, sleep, focus.
            // Let's use 'energy' instead of 'weight' for the first chart example if weight not found.

            const daysMap = {
                "7d": 7,
                "30d": 30,
                "90d": 90,
                "1y": 365
            };
            const days = daysMap[range];
            const sinceDate = subDays(new Date(), days).toISOString().split('T')[0];

            // Helper to process logs
            const processLogs = async (metricId: string) => {
                // service.getEntries returns all. We filter by date client side for MVP.
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
            // DataSeeder has 'energy' (1-5 rating). Let's use it as line chart.
            const wLogs = await processLogs('energy');
            setWeightLogs(wLogs);

            // 2. Focus
            const fLogs = await processLogs('focus');
            setFocusLogs(fLogs);

            // 3. Sleep
            const sLogs = await processLogs('sleep');
            setSleepLogs(sLogs);
        };

        if (db) {
            loadData();
        }
    }, [db, range, logService]); // Re-run when range changes


    return (
        <div className="space-y-6" data-testid="metric-charts">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-1.5 rounded-lg">📈</span>
                    趨勢分析
                </h2>
                <Tabs value={range} onValueChange={(v) => setRange(v as TimeRange)} className="w-auto">
                    <TabsList className="grid grid-cols-4 w-[240px] bg-muted/50">
                        <TabsTrigger value="7d" className="text-[10px] font-bold uppercase">7D</TabsTrigger>
                        <TabsTrigger value="30d" className="text-[10px] font-bold uppercase">30D</TabsTrigger>
                        <TabsTrigger value="90d" className="text-[10px] font-bold uppercase">90D</TabsTrigger>
                        <TabsTrigger value="1y" className="text-[10px] font-bold uppercase">1Y</TabsTrigger>
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
                                        hide={range === "1y"}
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

                {/* 2. Area Chart - Focus */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between opacity-80">
                            <span>專注度評分 (Rating)</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-full">1-10</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        {focusLogs.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={focusLogs}>
                                    <defs>
                                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="label"
                                        hide={range === "1y"}
                                        fontSize={10}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide domain={[0, 10]} />
                                    <Tooltip content={<CustomTooltip unit="pts" />} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorFocus)"
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
                                        hide={range === "1y"}
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
