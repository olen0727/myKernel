import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Area } from '@/services/mock-data-service'
import { Activity, Target } from 'lucide-react'

interface AreaCardProps {
    area: Area
    onClick?: () => void
}

export const AreaCard: React.FC<AreaCardProps> = ({ area, onClick }) => {
    return (
        <Card
            className="overflow-hidden cursor-pointer group hover:border-primary/50 transition-all duration-300"
            onClick={onClick}
        >
            <div className="relative">
                <AspectRatio ratio={16 / 9}>
                    <img
                        src={area.coverImage}
                        alt={area.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                </AspectRatio>
                <div className="absolute top-2 right-2">
                    <Badge variant={area.status === 'active' ? 'default' : 'secondary'} className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${area.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                        {area.status === 'active' ? 'Active' : 'Hidden'}
                    </Badge>
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{area.name}</h3>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    <span>{area.projectCount} Projects</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>{area.habitCount} Habits</span>
                </div>
            </CardFooter>
        </Card>
    )
}
