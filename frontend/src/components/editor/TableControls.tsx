import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/core'
import { Plus } from 'lucide-react'
import { createPortal } from 'react-dom'

interface TableControlsProps {
    editor: Editor
}

export function TableControls({ editor }: TableControlsProps) {
    const [tableRect, setTableRect] = useState<DOMRect | null>(null)
    const [isTableActive, setIsTableActive] = useState(false)

    // We update controls position on selection updates and scroll
    useEffect(() => {
        if (!editor) return

        const updateTableControls = () => {
            if (!editor.isActive('table')) {
                setIsTableActive(false)
                return
            }

            // Find the current table node in DOM
            // Strategy: Use the selection anchor to find the closest table parent
            const { from } = editor.state.selection
            const domPos = editor.view.domAtPos(from)

            // Allow for some flexibility in finding the table (it might be the node itself or a parent)
            let element: HTMLElement | null = domPos.node as HTMLElement
            if (element.nodeType === 3) { // Text node
                element = element.parentElement
            }

            const tableElement = element?.closest('table')

            if (tableElement) {
                setTableRect(tableElement.getBoundingClientRect())
                setIsTableActive(true)
            } else {
                setIsTableActive(false)
            }
        }

        editor.on('selectionUpdate', updateTableControls)
        editor.on('update', updateTableControls)
        editor.on('transaction', updateTableControls)

        // Listen to global scroll/resize to update position
        window.addEventListener('scroll', updateTableControls, true)
        window.addEventListener('resize', updateTableControls)

        // Initial check
        updateTableControls()

        return () => {
            editor.off('selectionUpdate', updateTableControls)
            editor.off('update', updateTableControls)
            editor.off('transaction', updateTableControls)
            window.removeEventListener('scroll', updateTableControls, true)
            window.removeEventListener('resize', updateTableControls)
        }
    }, [editor])

    if (!isTableActive || !tableRect) return null

    // We render into body to avoid overflow issues, similar to Tooltips
    return createPortal(
        <>
            {/* Add Column Button - Right side */}
            <button
                className="fixed flex items-center justify-center bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors rounded-sm z-50 cursor-pointer print:hidden"
                style={{
                    width: '16px',
                    height: tableRect.height, // Match table height
                    left: `${tableRect.right + 4}px`, // 4px gap
                    top: `${tableRect.top}px`,
                }}
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                title="Add Column"
            >
                <Plus className="w-3 h-3" />
            </button>

            {/* Add Row Button - Bottom side */}
            <button
                className="fixed flex items-center justify-center bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors rounded-sm z-50 cursor-pointer print:hidden"
                style={{
                    width: tableRect.width, // Match table width
                    height: '16px',
                    left: `${tableRect.left}px`,
                    top: `${tableRect.bottom + 4}px`, // 4px gap
                }}
                onClick={() => editor.chain().focus().addRowAfter().run()}
                title="Add Row"
            >
                <Plus className="w-3 h-3" />
            </button>
        </>,
        document.body
    )
}
