import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { cn } from "@/lib/utils"

interface TipTapEditorProps {
    content: string
    onChange?: (content: string) => void
    editable?: boolean
}

export function TipTapEditor({ content, onChange, editable = true }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write something...',
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[300px]',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className={cn("w-full transition-all", !editable && "opacity-80")}>
            <EditorContent editor={editor} />
        </div>
    )
}
