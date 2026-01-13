import React from "react"
import { StatCard } from "@/components/dashboard/StatCard"
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap"
import { MetricCharts } from "@/components/dashboard/MetricCharts"
import { Brain, Inbox, Folder, ListTodo } from "lucide-react"

const DashboardPage: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 tracking-tight">儀表板 Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="腦同步天數 (Brain-Sync Days)"
                    value={42}
                    icon={Brain}
                    description="寫過日記的總天數"
                />
                <StatCard
                    title="Inbox 未處理數"
                    value={5}
                    icon={Inbox}
                    description="待處理資源數量"
                />
                <StatCard
                    title="進行中專案 (Active Projects)"
                    value={3}
                    icon={Folder}
                    description="Active 狀態專案"
                />
                <StatCard
                    title="待辦任務 (Total Tasks)"
                    value={12}
                    icon={ListTodo}
                    description="未完成任務總量"
                />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8">
                <HabitHeatmap />
                <MetricCharts />
            </div>
        </div>
    )
}

export default DashboardPage
