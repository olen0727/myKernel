import React, { useMemo, useState } from "react"
import {
    LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- Types & Constants ---

import { generateMockMetricData } from "@/services/mock-data-service"

// --- Types & Constants ---

type TimeRange = "7d" | "30d" | "90d" | "1y"

// --- Components ---

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-bold text-primary">
                    {payload[0].value.toLocaleString()} <span className="text-[10px] opacity-70 uppercase">{unit}</span>
                </p>
            </div>
        )
    }
    return null
}

export const MetricCharts: React.FC = () => {
    const [range, setRange] = useState<TimeRange>("30d")

    const daysMap = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365
    }

    // Generate specific data for each chart type
    const weightData = useMemo(() => generateMockMetricData(daysMap[range], 65, 75), [range])
    const focusData = useMemo(() => generateMockMetricData(daysMap[range], 1, 10), [range])
    const sleepData = useMemo(() => generateMockMetricData(daysMap[range], 4, 9), [range])

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
                {/* 1. Line Chart (Number Type) - e.g. Weight */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between opacity-80">
                            <span>體重趨勢 (Number)</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 bg-primary/10 text-primary rounded-full">KG</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="label"
                                    hide={range === "1y"}
                                    fontSize={10}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip content={<CustomTooltip unit="kg" />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} />
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
                    </CardContent>
                </Card>

                {/* 2. Area Chart (Rating Type) - e.g. Focus Level */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between opacity-80">
                            <span>專注度評分 (Rating)</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-full">1-10</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={focusData}>
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
                    </CardContent>
                </Card>

                {/* 3. Scatter/Dot Plot (Time Type) - e.g. Sleep Duration */}
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden md:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center justify-between opacity-80">
                            <span>睡眠時長 (Time)</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full">HOURS</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    type="category"
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
                                    data={sleepData}
                                    fill="hsl(var(--primary))"
                                    animationDuration={1000}
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
