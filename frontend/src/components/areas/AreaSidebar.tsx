import React from 'react'
import { Area } from '@/services/mock-data-service'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Trash2, Info } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AreaSidebarProps {
    area: Area
    onUpdate: (updates: Partial<Area>) => void
    onDelete: () => void
}

export const AreaSidebar: React.FC<AreaSidebarProps> = ({ area, onUpdate, onDelete }) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        領域資訊
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                            id="description"
                            placeholder="描述此領域的責任範圍與目標..."
                            className="min-h-[120px] resize-none"
                            defaultValue={area.description}
                            onBlur={(e) => onUpdate({ description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="status">顯示狀態</Label>
                            <p className="text-xs text-muted-foreground">
                                隱藏後將不會出現在快捷選單中
                            </p>
                        </div>
                        <Switch
                            id="status"
                            checked={area.status === 'active'}
                            onCheckedChange={(checked) => onUpdate({ status: checked ? 'active' : 'hidden' })}
                        />
                    </div>

                </CardContent>
            </Card>

            <div className="pt-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            刪除此領域
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>確定要刪除領域「{area.name}」嗎？</AlertDialogTitle>
                            <AlertDialogDescription>
                                此動作無法復原。這將會移除此領域的分類標籤，但其下的專案與資源將不會被刪除，而是變回「未分類」。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                                確認刪除
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
