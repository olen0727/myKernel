import React from 'react'
import { Area } from '@/services/mock-data-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Camera, Target, Activity } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface AreaHeaderProps {
    area: Area
    onTitleChange?: (title: string) => void
    onImageClick?: () => void
}

export const AreaHeader: React.FC<AreaHeaderProps> = ({ area, onTitleChange, onImageClick }) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [title, setTitle] = React.useState(area.name)

    const handleBlur = () => {
        setIsEditing(false)
        if (title !== area.name && onTitleChange) {
            onTitleChange(title)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur()
        }
    }

    return (
        <div className="relative w-full group overflow-hidden bg-accent rounded-xl shadow-sm border border-border">
            <div className="relative h-48 md:h-64">
                <img
                    src={area.coverImage}
                    alt={area.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onImageClick}
                >
                    <Camera className="w-4 h-4" />
                </Button>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <input
                                    autoFocus
                                    className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-primary outline-none text-white w-full"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                />
                            ) : (
                                <h1
                                    className="text-3xl md:text-4xl font-bold text-white cursor-pointer hover:text-white/80 transition-colors"
                                    onClick={() => setIsEditing(true)}
                                >
                                    {area.name}
                                </h1>
                            )}
                            <Badge variant={area.status === 'active' ? 'default' : 'secondary'} className="bg-white/20 backdrop-blur-md text-white border-white/30">
                                {area.status === 'active' ? 'Active' : 'Hidden'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-white/90">
                            <div className="flex items-center gap-1.5 font-medium">
                                <Target className="w-4 h-4" />
                                <span>{area.projectCount} 進行中專案</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                                <Activity className="w-4 h-4" />
                                <span>{area.habitCount} 核心習慣</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
