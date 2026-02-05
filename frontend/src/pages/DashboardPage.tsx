import React, { useEffect, useState, useMemo } from "react"
import { StatCard } from "@/components/dashboard/StatCard"
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap"
import { MetricCharts } from "@/components/dashboard/MetricCharts"
import { Brain, Inbox, Folder, ListTodo } from "lucide-react"
import { useObservable } from "@/hooks/use-observable"
import { services, ProjectService, HabitService, TaskService, ResourceService, AreaService } from "@/services"
import { Project, Habit, Task, Resource, Area } from "@/types/models"

const DashboardPage: React.FC = () => {
    const [projectService, setProjectService] = useState<ProjectService | undefined>();
    const [habitService, setHabitService] = useState<HabitService | undefined>();
    const [taskService, setTaskService] = useState<TaskService | undefined>();
    const [resourceService, setResourceService] = useState<ResourceService | undefined>();
    const [areaService, setAreaService] = useState<AreaService | undefined>();

    useEffect(() => {
        const loadServices = async () => {
            setProjectService(await services.project);
            setHabitService(await services.habit);
            setTaskService(await services.task);
            setResourceService(await services.resource);
            setAreaService(await services.area);
        };
        loadServices();
    }, []);

    const projects$ = useMemo(() => projectService?.getAll$(), [projectService]);
    const habits$ = useMemo(() => habitService?.getAll$(), [habitService]);
    const tasks$ = useMemo(() => taskService?.getAll$(), [taskService]);
    const resources$ = useMemo(() => resourceService?.getAll$(), [resourceService]);
    const areas$ = useMemo(() => areaService?.getAll$(), [areaService]);

    const projects = useObservable<Project[]>(projects$, []) || [];
    const habits = useObservable<Habit[]>(habits$, []) || [];
    const areas = useObservable<Area[]>(areas$, []) || [];

    // Filter habits:
    // 1. Must not be paused or archived
    // 2. Must not be an orphan (if it has an areaId, the area must exist)
    const activeHabits = useMemo(() => {
        const activeAreaIds = new Set(areas.map(a => a.id));
        return habits.filter(h =>
            (h.status !== 'paused' && h.status !== 'archived') &&
            (!h.areaId || activeAreaIds.has(h.areaId))
        );
    }, [habits, areas]);

    const tasks = useObservable<Task[]>(tasks$, []) || [];
    const resources = useObservable<Resource[]>(resources$, []) || [];

    // Calculations
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;

    // Inbox: Resources with no project/area
    const inboxCount = resources.filter(r => !r.projectId && !r.areaId).length;

    // Brain-Sync Days: Habits where name includes '日記' or completed dates of all?
    // Using the 'Journal' habit's completed streak or count.
    const journalHabit = habits.find(h => h.name?.includes('日記') || h.name?.includes('Journal'));
    const brainSyncDays = journalHabit ? (journalHabit.completedDates?.length || 0) : 0;

    const stats = [
        { title: "腦同步天數 (Brain-Sync Days)", value: brainSyncDays, description: "寫過日記的總天數", icon: Brain },
        { title: "Inbox 未處理數", value: inboxCount, description: "待處理資源數量", icon: Inbox },
        { title: "進行中專案 (Active Projects)", value: activeProjects, description: "Active 狀態專案", icon: Folder },
        { title: "待辦任務 (Total Tasks)", value: pendingTasks, description: "未完成任務總量", icon: ListTodo },
    ];

    if (!projectService) {
        return <div className="p-8 flex justify-center items-center">Loading dashboard...</div>;
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 tracking-tight">儀表板 Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        description={stat.description}
                    />
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8">
                <HabitHeatmap habits={activeHabits} />
                <MetricCharts />
            </div>
        </div>
    )
}

export default DashboardPage
