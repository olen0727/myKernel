import React from "react"
import { StatCard } from "@/components/dashboard/StatCard"
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap"
import { MetricCharts } from "@/components/dashboard/MetricCharts"
import { Brain, Inbox, Folder, ListTodo } from "lucide-react"
import { DASHBOARD_STATS } from "@/services/mock-data-service"

const DashboardPage: React.FC = () => {
    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 tracking-tight">儀表板 Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DASHBOARD_STATS.map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.title}
                        value={stat.value}
                        icon={i === 0 ? Brain : i === 1 ? Inbox : i === 2 ? Folder : ListTodo}
                        description={stat.description}
                    />
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8">
                <HabitHeatmap />
                <MetricCharts />
            </div>
        </div>
    )
}

export default DashboardPage
