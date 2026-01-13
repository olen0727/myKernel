import { TaskItem } from "@/components/tasks/TaskItem"
import { ScrollArea } from "@/components/ui/scroll-area"

const MOCK_DOING_TASKS = [
    { id: "1", title: "完成專案列表 UI 實作", projectName: "Kernel", completed: false },
    { id: "2", title: "修復全站搜尋 Bug", projectName: "Kernel", completed: false },
]

const MOCK_TODO_TASKS = [
    { id: "3", title: "設計資料庫 Schema", projectName: "Backend API", completed: false },
    { id: "4", title: "撰寫單元測試", projectName: "Kernel", completed: false },
    { id: "5", title: "與 UI/UX 團隊對接", projectName: "Design System", completed: false },
    { id: "6", title: "研究 RxDB 分離存儲", projectName: "Kernel", completed: false },
    { id: "7", title: "更新專案文件", projectName: "Infrastructure", completed: false },
    { id: "8", title: "優化首頁載入速度", projectName: "Frontend", completed: false },
    { id: "9", title: "實作使用者權限管理", projectName: "Admin Portal", completed: false },
    { id: "10", title: "修復行動版佈局問題", projectName: "Kernel", completed: false },
]

export function Workbench() {
    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-b overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
                <h2 className="text-lg font-semibold tracking-tight">Workbench 工作台</h2>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Do Today Column */}
                <div className="flex-1 flex flex-col border-r">
                    <div className="px-6 py-3 bg-muted/10 border-b">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Do Today 焦點</h3>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-1">
                            {MOCK_DOING_TASKS.map(task => (
                                <TaskItem key={task.id} {...task} />
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Todo Column */}
                <div className="flex-1 flex flex-col">
                    <div className="px-6 py-3 bg-muted/10 border-b">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Todo 待辦</h3>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-1">
                            {MOCK_TODO_TASKS.map(task => (
                                <TaskItem key={task.id} {...task} />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
