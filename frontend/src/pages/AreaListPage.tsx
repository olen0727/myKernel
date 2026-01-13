import React from 'react'
import { Plus } from 'lucide-react'
import { AreaCard } from '@/components/areas/AreaCard'
import { CreateAreaModal } from '@/components/areas/CreateAreaModal'
import { Area, INITIAL_AREAS } from '@/services/mock-data-service'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AreaListPage: React.FC = () => {
    const [areas, setAreas] = React.useState<Area[]>(INITIAL_AREAS)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const navigate = useNavigate()

    const handleCreateArea = (name: string, coverImage: string) => {
        const newArea: Area = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            status: 'active',
            projectCount: 0,
            habitCount: 0,
            coverImage
        }
        setAreas([...areas, newArea])
        toast.success(`領域 "${name}" 已建立`)
    }

    const handleAreaClick = (areaId: string) => {
        navigate(`/areas/${areaId}`)
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Areas 領域列表</h1>
                <p className="text-muted-foreground">檢視與管理你的人生版圖。</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {areas.map(area => (
                    <AreaCard
                        key={area.id}
                        area={area}
                        onClick={() => handleAreaClick(area.id)}
                    />
                ))}

                {/* New Area Entry */}
                <Card
                    className="border-dashed border-2 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all min-h-[250px]"
                    onClick={() => setIsModalOpen(true)}
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
                onCreate={handleCreateArea}
            />
        </div>
    )
}

export default AreaListPage
