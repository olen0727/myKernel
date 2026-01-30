import React, { useMemo, useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { AreaCard } from '@/components/areas/AreaCard'
import { CreateAreaModal } from '@/components/areas/CreateAreaModal'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { services, AreaService, ProjectService, HabitService } from '@/services'
import { useObservable } from '@/hooks/use-observable'
import { Area, Project, Habit } from '@/types/models'

const AreaListPage: React.FC = () => {
    const navigate = useNavigate()

    const [areaService, setAreaService] = useState<AreaService | undefined>();
    const [projectService, setProjectService] = useState<ProjectService | undefined>();
    const [habitService, setHabitService] = useState<HabitService | undefined>();

    useEffect(() => {
        const load = async () => {
            setAreaService(await services.area);
            setProjectService(await services.project);
            setHabitService(await services.habit);
        };
        load();
    }, []);

    const areas$ = useMemo(() => areaService?.getAll$(), [areaService]);
    const projects$ = useMemo(() => projectService?.getAll$(), [projectService]);
    const habits$ = useMemo(() => habitService?.getAll$(), [habitService]);

    const areas = useObservable<Area[]>(areas$, []) || [];
    const projects = useObservable<Project[]>(projects$, []) || [];
    const habits = useObservable<Habit[]>(habits$, []) || [];

    const [isModalOpen, setIsModalOpen] = React.useState(false)

    // Map DB areas to UI Model (adding counts)
    const mappedAreas = useMemo(() => {
        return areas.map(area => {
            const projectCount = projects.filter(p => p.areaId === area.id).length;
            // Habit model doesn't explicitly store areaId in the interface we saw earlier?
            // Checking models.ts: Habit extends BaseModel. No areaId.
            // If Habit lacks areaId, habitCount will be 0 or we need to check if habits are linked differently.
            // Assuming 0 for now if no areaId in Habit.
            const habitCount = 0;

            return {
                ...area,
                status: 'active', // Default status for UI
                projectCount,
                habitCount
            };
        });
    }, [areas, projects, habits]);

    const handleCreateArea = async (name: string, coverImage: string) => {
        if (!areaService) return;
        try {
            await areaService.create({
                name,
                coverImage,
                description: ''
            });
            toast.success(`領域 "${name}" 已建立`);
            // Area list updates automatically via Observable
        } catch (e) {
            toast.error("建立領域失敗");
        }
    }

    const handleAreaClick = (areaId: string) => {
        navigate(`/areas/${areaId}`)
    }

    if (!areaService) {
        return <div className="h-full flex items-center justify-center">Loading Areas...</div>
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Areas 領域列表</h1>
                <p className="text-muted-foreground">檢視與管理你的人生版圖。</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mappedAreas.map(area => (
                    <AreaCard
                        key={area.id}
                        area={area as any} // Cast to match Mock Area interface expectation
                        onClick={() => handleAreaClick(area.id)}
                    />
                ))}

                {/* New Area Entry */}
                <Card
                    role="button"
                    tabIndex={0}
                    aria-label="新增新領域"
                    className="border-dashed border-2 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all min-h-[250px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setIsModalOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setIsModalOpen(true)
                        }
                    }}
                >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-semibold text-lg">新增新領域</span>
                    <p className="text-sm text-muted-foreground text-center mt-2 px-4 italic">建立新的關注領域來組織你的生活</p>
                </Card>
            </div>

            <CreateAreaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateArea}
            />
        </div>
    )
}

export default AreaListPage
