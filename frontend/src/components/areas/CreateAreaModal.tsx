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

interface CreateAreaModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (name: string, coverImage: string) => void
    initialData?: {
        name: string
        coverImage: string
    }
}

const DEFAULT_COVERS = [
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop"
]

export const CreateAreaModal: React.FC<CreateAreaModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = React.useState('')
    const [selectedCover, setSelectedCover] = React.useState(DEFAULT_COVERS[0])
    const [activeTab, setActiveTab] = React.useState<'gallery' | 'upload'>('gallery')

    // 當 Modal 開啟或 initialData 改變時重置狀態
    React.useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '')
            setSelectedCover(initialData?.coverImage || DEFAULT_COVERS[0])
        }
    }, [isOpen, initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onSubmit(name, selectedCover)
            setName('')
            onClose()
        }
    }

    const isEditMode = !!initialData

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? '編輯領域設定' : '建立新領域'}</DialogTitle>
                        <DialogDescription>
                            {isEditMode ? '修改領域名稱或封面圖片。' : '建立一個新的領域來組織你的專案與習慣。'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
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

                        <div className="grid gap-3">
                            <Label>封面圖片</Label>
                            <div className="flex gap-4 border-b pb-2 mb-2">
                                <button
                                    type="button"
                                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'gallery' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                                    onClick={() => setActiveTab('gallery')}
                                >
                                    精選藝廊
                                </button>
                                <button
                                    type="button"
                                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                                    onClick={() => setActiveTab('upload')}
                                >
                                    上傳圖片
                                </button>
                            </div>

                            {activeTab === 'gallery' ? (
                                <div className="grid grid-cols-3 gap-2 h-[200px] overflow-y-auto pr-1">
                                    {DEFAULT_COVERS.map((cover, idx) => (
                                        <div
                                            key={idx}
                                            className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all h-24 ${selectedCover === cover ? 'border-primary scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                            onClick={() => setSelectedCover(cover)}
                                        >
                                            <img src={cover} alt={`Cover ${idx}`} className="object-cover w-full h-full" />
                                            {selectedCover === cover && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-1 scale-75">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed rounded-lg bg-muted/30 p-4 text-center">
                                    <div className="bg-background p-3 rounded-full mb-3 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-muted-foreground">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium">點擊或拖放檔案以上傳</p>
                                    <p className="text-xs text-muted-foreground mt-1">支援 JPG, PNG (最大 5MB)</p>
                                    <p className="text-[10px] text-primary/60 mt-4 italic">
                                        TODO: 實作 FileReader API 轉換 Base64 或對接 Storage 服務
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>取消</Button>
                        <Button type="submit">{isEditMode ? '儲存變更' : '建立領域'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
