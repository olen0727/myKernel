import { BubbleMenu, BubbleMenuProps } from '@tiptap/react/menus'

import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCallback } from 'react'

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'>


export function EditorBubbleMenu(props: EditorBubbleMenuProps) {
    if (!props.editor) return null

    const setLink = useCallback(() => {
        const previousUrl = props.editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            props.editor?.chain().extendMarkRange('link').unsetLink().run()

            return
        }

        // update
        props.editor?.chain().extendMarkRange('link').setLink({ href: url }).run()

    }, [props.editor])

    return (
        <BubbleMenu
            {...props}
            className="flex items-center gap-1 rounded-lg border bg-popover p-1 shadow-md"
        >

            <button
                onClick={() => props.editor?.chain().toggleBold().run()}

                className={cn(
                    "p-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                    props.editor.isActive('bold') && "bg-accent text-accent-foreground"
                )}
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => props.editor?.chain().toggleItalic().run()}

                className={cn(
                    "p-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                    props.editor.isActive('italic') && "bg-accent text-accent-foreground"
                )}
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => props.editor?.chain().toggleStrike().run()}

                className={cn(
                    "p-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                    props.editor.isActive('strike') && "bg-accent text-accent-foreground"
                )}
            >
                <Strikethrough className="w-4 h-4" />
            </button>
            <button
                onClick={() => props.editor?.chain().toggleCode().run()}

                className={cn(
                    "p-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                    props.editor.isActive('code') && "bg-accent text-accent-foreground"
                )}
            >
                <Code className="w-4 h-4" />
            </button>
            <button
                onClick={setLink}
                className={cn(
                    "p-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors",
                    props.editor.isActive('link') && "bg-accent text-accent-foreground"
                )}
            >
                <LinkIcon className="w-4 h-4" />
            </button>
        </BubbleMenu>
    )
}
