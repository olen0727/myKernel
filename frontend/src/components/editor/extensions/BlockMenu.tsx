import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
    Copy,
    Trash,
    Type,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Code
} from "lucide-react"
import { Editor } from "@tiptap/react"

interface BlockMenuProps {
    editor: Editor
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    position: { x: number; y: number } | null
    targetNode: any | null // Tiptap node
    targetPos: number | null // Node position
}

export function BlockMenu({ editor, isOpen, onOpenChange, position, targetPos }: BlockMenuProps) {
    if (!position || targetPos === null) return null;

    const runCommand = (command: () => void) => {
        command()
        onOpenChange(false)
    }

    // Helper to clear and set node type
    const setNodeType = (type: string, attributes = {}) => {
        if (targetPos === null) return
        runCommand(() => {
            // Select the node at targetPos first
            // clearNodes might strip wrapping list items if any
            editor.chain().setNodeSelection(targetPos).clearNodes().setNode(type, attributes).run()
        })
    }

    const toggleList = (listType: 'bulletList' | 'orderedList' | 'taskList') => {
        if (targetPos === null) return
        runCommand(() => {
            // Ensure selection logic
            // Ideally we check if it is already that list, but toggle handles it
            editor.chain().setNodeSelection(targetPos).run()

            if (listType === 'bulletList') editor.chain().toggleBulletList().run()
            if (listType === 'orderedList') editor.chain().toggleOrderedList().run()
            if (listType === 'taskList') editor.chain().toggleTaskList().run()
        })
    }


    return (
        <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                {/* Invisible trigger positioned at the handle */}
                <div
                    style={{
                        position: 'fixed',
                        left: position.x,
                        top: position.y,
                        width: 1,
                        height: 1,
                        pointerEvents: 'none'
                    }}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>區塊選項</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => {
                    if (targetPos !== null) {
                        runCommand(() => {
                            editor.chain().setNodeSelection(targetPos).deleteSelection().run()
                        })
                    }
                }} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>刪除</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => {
                    if (targetPos !== null) {
                        runCommand(() => {
                            // Duplicate logic: get node, insert copy
                            const node = editor.state.doc.nodeAt(targetPos)
                            if (node) {
                                editor.chain().insertContentAt(targetPos + node.nodeSize, node.toJSON()).run()
                            }
                        })
                    }
                }}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>複製</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Type className="mr-2 h-4 w-4" />
                        <span>轉換類型</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                        <DropdownMenuItem onClick={() => setNodeType('paragraph')}>
                            <Type className="mr-2 h-4 w-4" />
                            <span>Text</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNodeType('heading', { level: 1 })}>
                            <Heading1 className="mr-2 h-4 w-4" />
                            <span>Heading 1</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNodeType('heading', { level: 2 })}>
                            <Heading2 className="mr-2 h-4 w-4" />
                            <span>Heading 2</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNodeType('heading', { level: 3 })}>
                            <Heading3 className="mr-2 h-4 w-4" />
                            <span>Heading 3</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleList('bulletList')}>
                            <List className="mr-2 h-4 w-4" />
                            <span>Bullet List</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleList('orderedList')}>
                            <ListOrdered className="mr-2 h-4 w-4" />
                            <span>Numbered List</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleList('taskList')}>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            <span>To-do List</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setNodeType('blockquote')}>
                            <Quote className="mr-2 h-4 w-4" />
                            <span>Quote</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNodeType('codeBlock')}>
                            <Code className="mr-2 h-4 w-4" />
                            <span>Code Block</span>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
