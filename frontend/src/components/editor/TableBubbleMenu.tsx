import { BubbleMenu, BubbleMenuProps } from '@tiptap/react/menus'
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
    Plus,
    Minus,
    Columns,
    Rows,
    Trash,
    Split,
    Merge,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    Bold,
    Italic,
    Strikethrough,
    Code,
    Link as LinkIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/core'
import { Separator } from '@/components/ui/separator'
import { moveRow, moveColumn } from './utils/table-functions'
import { useCallback } from 'react'

interface TableBubbleMenuProps {
    editor: Editor
}

export function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
    if (!editor) return null

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor?.chain().extendMarkRange('link').unsetLink().run()
            return
        }
        editor?.chain().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => {
                return editor.isActive('table')
            }}
            className="flex items-center gap-1 rounded-lg border bg-popover p-1 shadow-md overflow-hidden max-w-[90vw] flex-wrap"
        >
            <div className="flex items-center gap-1">
                <button
                    onClick={() => editor.chain().toggleBold().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                        editor.isActive('bold') && "bg-accent text-accent-foreground"
                    )}
                >
                    <Bold className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().toggleItalic().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                        editor.isActive('italic') && "bg-accent text-accent-foreground"
                    )}
                >
                    <Italic className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().toggleStrike().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                        editor.isActive('strike') && "bg-accent text-accent-foreground"
                    )}
                >
                    <Strikethrough className="w-3 h-3" />
                </button>
                <button
                    onClick={() => editor.chain().toggleCode().run()}
                    className={cn(
                        "p-1.5 rounded hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                        editor.isActive('code') && "bg-accent text-accent-foreground"
                    )}
                >
                    <Code className="w-3 h-3" />
                </button>
                <button
                    onClick={setLink}
                    className={cn(
                        "p-1.5 rounded hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                        editor.isActive('link') && "bg-accent text-accent-foreground"
                    )}
                >
                    <LinkIcon className="w-3 h-3" />
                </button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <button
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Add Column Before"
                >
                    <div className="flex items-center"><Columns className="w-3 h-3 rotate-90" /><Plus className="w-2 h-2 -ml-1" /></div>
                </button>
                <button
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Add Column After"
                >
                    <div className="flex items-center"><Columns className="w-3 h-3 rotate-90" /><Plus className="w-2 h-2 -ml-1" /></div>
                </button>
                <button
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    className="p-1.5 rounded hover:bg-accent text-red-500"
                    title="Delete Column"
                >
                    <div className="flex items-center"><Columns className="w-3 h-3 rotate-90" /><Minus className="w-2 h-2 -ml-1" /></div>
                </button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <button
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Add Row Before"
                >
                    <div className="flex items-center"><Rows className="w-3 h-3" /><Plus className="w-2 h-2 -ml-1" /></div>
                </button>
                <button
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Add Row After"
                >
                    <div className="flex items-center"><Rows className="w-3 h-3" /><Plus className="w-2 h-2 -ml-1" /></div>
                </button>
                <button
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    className="p-1.5 rounded hover:bg-accent text-red-500"
                    title="Delete Row"
                >
                    <div className="flex items-center"><Rows className="w-3 h-3" /><Minus className="w-2 h-2 -ml-1" /></div>
                </button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <button
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Merge Cells"
                >
                    <Merge className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().splitCell().run()}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Split Cell"
                >
                    <Split className="w-4 h-4" />
                </button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <button
                    onClick={() => moveColumn(editor, 'left')}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Move Column Left"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => moveColumn(editor, 'right')}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Move Column Right"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => moveRow(editor, 'up')}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Move Row Up"
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
                <button
                    onClick={() => moveRow(editor, 'down')}
                    className="p-1.5 rounded hover:bg-accent text-popover-foreground"
                    title="Move Row Down"
                >
                    <ArrowDown className="w-4 h-4" />
                </button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="p-1.5 rounded hover:bg-accent text-red-600 font-medium text-xs flex items-center gap-1"
                title="Delete Table"
            >
                <Trash className="w-4 h-4" />
            </button>


        </BubbleMenu>
    )
}
