import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface CreateAreaModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (name: string, coverImage: string) => void
}

const DEFAULT_COVERS = [
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop"
]

export const CreateAreaModal: React.FC<CreateAreaModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = React.useState('')
    const [selectedCover, setSelectedCover] = React.useState(DEFAULT_COVERS[0])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onCreate(name, selectedCover)
            setName('')
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>建立新領域</DialogTitle>
                        <DialogDescription>
                            建立一個新的領域來組織你的專案與習慣。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">領域名稱</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="例如：自我成長、職場工作..."
                                autoFocus
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>選擇封面圖</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {DEFAULT_COVERS.map((cover, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedCover === cover ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        onClick={() => setSelectedCover(cover)}
                                    >
                                        <AspectRatio ratio={16 / 9}>
                                            <img src={cover} alt={`Cover ${idx}`} className="object-cover w-full h-full" />
                                        </AspectRatio>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>取消</Button>
                        <Button type="submit">建立領域</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
