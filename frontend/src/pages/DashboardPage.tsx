import React, { useEffect, useState, useMemo } from "react"
import { StatCard } from "@/components/dashboard/StatCard"
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap"
import { MetricCharts } from "@/components/dashboard/MetricCharts"
import { Brain, Inbox, Folder, ListTodo } from "lucide-react"
import { useObservable } from "@/hooks/use-observable"
import { services, ProjectService, HabitService, TaskService, ResourceService, AreaService, LogService } from "@/services"
import { Project, Habit, Task, Resource, Area, Log } from "@/types/models"

const DashboardPage: React.FC = () => {
    const [projectService, setProjectService] = useState<ProjectService | undefined>();
    const [habitService, setHabitService] = useState<HabitService | undefined>();
    const [taskService, setTaskService] = useState<TaskService | undefined>();
    const [resourceService, setResourceService] = useState<ResourceService | undefined>();
    const [areaService, setAreaService] = useState<AreaService | undefined>();
    const [logService, setLogService] = useState<LogService | undefined>();

    useEffect(() => {
        const loadServices = async () => {
            setProjectService(await services.project);
            setHabitService(await services.habit);
            setTaskService(await services.task);
            setResourceService(await services.resource);
            setAreaService(await services.area);
            setLogService(await services.log);
        };
        loadServices();
    }, []);

    const projects$ = useMemo(() => projectService?.getAll$(), [projectService]);
    const habits$ = useMemo(() => habitService?.getAll$(), [habitService]);
    const tasks$ = useMemo(() => taskService?.getAll$(), [taskService]);
    const resources$ = useMemo(() => resourceService?.getAll$(), [resourceService]);
    const areas$ = useMemo(() => areaService?.getAll$(), [areaService]);
    const logs$ = useMemo(() => logService?.getAll$(), [logService]);

    const projects = useObservable<Project[]>(projects$, []) || [];
    const habits = useObservable<Habit[]>(habits$, []) || [];
    const areas = useObservable<Area[]>(areas$, []) || [];
    const logs = useObservable<Log[]>(logs$, []) || [];

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

    // Match Workbench logic: include 'todo' and 'doing', exclude 'done'/'checked' AND exclude paused projects
    const pendingTasks = tasks.filter(t => {
        if (t.status === 'done' || t.status === 'checked') return false;
        const proj = projects.find(p => p.id === t.projectId);
        if (!proj) return false; // Exclude ghost tasks or tasks without a valid project
        if (proj.status === 'paused') return false;
        return true;
    }).length;

    // Inbox: Resources with no project/area
    const inboxCount = resources.filter(r => (!r.projectIds || r.projectIds.length === 0) && (!r.areaIds || r.areaIds.length === 0)).length;

    // Brain-Sync Days: Unique dates where action === 'daily_note'
    const brainSyncDays = useMemo(() => {
        const uniqueDates = new Set(
            logs.filter(l => l.action === 'daily_note').map(l => l.date)
        );
        return uniqueDates.size;
    }, [logs]);

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
                <MetricCharts tasks={tasks} />
            </div>
        </div>
    )
}

export default DashboardPage
