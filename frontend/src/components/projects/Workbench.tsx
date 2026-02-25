import * as React from "react"
import { TaskItem } from "@/components/tasks/TaskItem"
import { SortableTaskItem } from "@/components/tasks/SortableTaskItem"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GripVertical } from "lucide-react"
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
    useDroppable,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { TaskService, ProjectService, services } from "@/services"
import { useObservable } from "@/hooks/use-observable"
import { Task, Project } from "@/types/models"

export function Workbench() {
    const [taskService, setTaskService] = React.useState<TaskService | undefined>();
    const [projectService, setProjectService] = React.useState<ProjectService | undefined>();

    React.useEffect(() => {
        const load = async () => {
            setTaskService(await services.task);
            setProjectService(await services.project);
        };
        load();
    }, []);

    const tasks$ = React.useMemo(() => taskService?.getAll$(), [taskService]);
    const projects$ = React.useMemo(() => projectService?.getAll$(), [projectService]);

    const allTasks = useObservable<Task[]>(tasks$, []) || [];
    const allProjects = useObservable<Project[]>(projects$, []) || [];

    const doingTasks = React.useMemo(() =>
        allTasks
            .filter(t => t.status === 'doing' || t.status === 'done')
            .filter(t => allProjects.some(p => p.id === t.projectId && p.status !== 'paused'))
            .map(t => ({
                ...t,
                projectName: allProjects.find(p => p.id === t.projectId)?.name
            }))
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
        [allTasks, allProjects]);

    const todoTasks = React.useMemo(() =>
        allTasks
            .filter(t => t.status === 'todo')
            .filter(t => allProjects.some(p => p.id === t.projectId && p.status !== 'paused'))
            .map(t => ({
                ...t,
                projectName: allProjects.find(p => p.id === t.projectId)?.name
            }))
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
        [allTasks, allProjects]);

    const [activeId, setActiveId] = React.useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const activeTask = React.useMemo(() => {
        return [...doingTasks, ...todoTasks].find(t => t.id === activeId)
    }, [activeId, doingTasks, todoTasks])

    const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

    const handleDragOver = (_event: DragOverEvent) => {
        // Visual feedback only, logic handled in DragEnd for database updates to avoid thrashing
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || !taskService) return

        const activeId = active.id as string
        const overId = over.id as string

        // Find if dropped over a container directly or an item in a container
        const overContainer =
            overId === "doing" || overId === "todo" ? overId :
                doingTasks.some(t => t.id === overId) ? "doing" :
                    todoTasks.some(t => t.id === overId) ? "todo" : null;

        if (!overContainer) return;

        // Determine new status
        const task = allTasks.find(t => t.id === activeId);
        const newStatus = overContainer === "todo" ? 'todo' : (task?.status === 'done' ? 'done' : 'doing');

        if (activeId !== overId) {
            const targetList = newStatus === 'doing' ? doingTasks : todoTasks;

            if (task?.status === newStatus) {
                // Reordering within the same column
                const oldIndex = targetList.findIndex(t => t.id === activeId);
                const newIndex = targetList.findIndex(t => t.id === overId);
                if (oldIndex !== -1 && newIndex !== -1) {
                    const reordered = arrayMove(targetList, oldIndex, newIndex);
                    reordered.forEach((t, i) => {
                        if (t.order !== i) {
                            taskService.update(t.id, { order: i });
                        }
                    });
                }
            } else if (task) {
                // Moving between columns
                const newIndex = targetList.findIndex(t => t.id === overId);
                let updatedList = [...targetList];
                const updatedTask = {
                    ...task,
                    status: newStatus as 'todo' | 'doing' | 'done',
                    projectName: allProjects.find(p => p.id === task.projectId)?.name
                };

                if (newIndex !== -1) {
                    updatedList.splice(newIndex, 0, updatedTask);
                } else {
                    updatedList.push(updatedTask);
                }

                updatedList.forEach((t, i) => {
                    if (t.id === activeId) {
                        taskService.update(t.id, { status: newStatus, order: i });
                    } else if (t.order !== i) {
                        taskService.update(t.id, { order: i });
                    }
                });
            }
        } else if (task && task.status !== newStatus) {
            await taskService.update(activeId, { status: newStatus });
        }

        setActiveId(null)
    }

    const handleToggleTask = async (id: string) => {
        if (!taskService) return;
        const task = allTasks.find(t => t.id === id);
        if (task) {
            const newStatus = task.status === 'done' ? 'doing' : 'done';
            await taskService.update(id, { status: newStatus });
        }
    }

    const handleCheckTasks = async () => {
        if (!taskService) return;
        const tasksToCheck = doingTasks.filter(t => t.status === 'done');
        for (const t of tasksToCheck) {
            await taskService.update(t.id, { status: 'checked' });
        }
    }

    const handleTitleChange = async (id: string, newTitle: string) => {
        if (!taskService) return;
        await taskService.update(id, { title: newTitle });
    }

    const handleUrgencyChange = async (id: string, urgency: 'orange' | 'red' | null) => {
        if (!taskService) return;
        await taskService.update(id, { urgency });
    }

    const handleTomatoesChange = async (id: string, tomatoes: number) => {
        if (!taskService) return;
        await taskService.update(id, { tomatoes });
    }

    const handleDeleteTask = async (id: string) => {
        if (!taskService) return;
        await taskService.delete(id);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-b overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                    <h2 className="text-lg font-semibold tracking-tight">Workbench 工作台</h2>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <DroppableColumn
                        id="doing"
                        title="Do Today 焦點"
                        tasks={doingTasks}
                        headerAction={
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-3"
                                onClick={handleCheckTasks}
                                disabled={!doingTasks.some(t => t.status === 'done')}
                            >
                                Check Tasks
                            </Button>
                        }
                        onToggle={handleToggleTask}
                        onTitleChange={handleTitleChange}
                        onUrgencyChange={handleUrgencyChange}
                        onTomatoesChange={handleTomatoesChange}
                        onDelete={handleDeleteTask}
                    />
                    <DroppableColumn
                        id="todo"
                        title="Todo 待辦"
                        tasks={todoTasks}
                        isLast
                        onToggle={handleToggleTask}
                        onTitleChange={handleTitleChange}
                        onUrgencyChange={handleUrgencyChange}
                        onTomatoesChange={handleTomatoesChange}
                        onDelete={handleDeleteTask}
                    />
                </div>
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.4',
                        },
                    },
                }),
            }}>
                {activeTask ? (
                    <div className="w-[300px] bg-background/70 backdrop-blur-sm border-2 border-primary/30 rounded-md shadow-2xl p-2 flex items-center gap-3 scale-95 origin-center rotate-1 transition-transform cursor-grabbing opacity-70">
                        <GripVertical className="h-4 w-4 text-primary" />
                        <TaskItem {...activeTask} editable={false} isWorkbench={true} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

function DroppableColumn({
    id,
    title,
    tasks,
    isLast = false,
    headerAction,
    onToggle,
    onTitleChange,
    onUrgencyChange,
    onTomatoesChange,
    onDelete
}: {
    id: string,
    title: string,
    tasks: any[],
    isLast?: boolean,
    headerAction?: React.ReactNode,
    onToggle: (id: string) => void,
    onTitleChange: (id: string, title: string) => void,
    onUrgencyChange: (id: string, urgency: 'orange' | 'red' | null) => void,
    onTomatoesChange: (id: string, tomatoes: number) => void,
    onDelete: (id: string) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id })

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 flex flex-col transition-colors",
                !isLast && "border-r",
                isOver && "bg-accent/10"
            )}
        >
            <div className="flex items-center justify-between px-6 py-3 bg-muted/10 border-b">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
                {headerAction}
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-1">
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map(task => (
                            <SortableTaskItem
                                key={task.id}
                                {...task}
                                isWorkbench={true}
                                onToggle={onToggle}
                                onTitleChange={onTitleChange}
                                onUrgencyChange={onUrgencyChange}
                                onTomatoesChange={onTomatoesChange}
                                onDelete={onDelete}
                            />
                        ))}
                    </SortableContext>
                </div>
            </ScrollArea>
        </div>
    )
}
