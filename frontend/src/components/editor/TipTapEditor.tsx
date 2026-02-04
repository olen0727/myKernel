import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import DragHandle from '@tiptap/extension-drag-handle'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { cn } from "@/lib/utils"
import { TableBubbleMenu } from './TableBubbleMenu'
import { TableControls } from './TableControls'
// Extensions
import { configureSlashCommand } from './extensions/slash-command'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import 'tippy.js/dist/tippy.css' // Import tippy styles for the slash menu
import './editor.css'

// New Imports
import { BlockMenu } from './extensions/BlockMenu'
import { useState, useEffect, useRef } from 'react'



const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

const parseInlineMarkdown = (value: string) => {
    let html = escapeHtml(value)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')
    html = html.replace(/~~([^~]+)~~/g, '<s>$1</s>')
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>')
    return html
}

const parseMarkdown = (markdown: string) => {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n")
    const blocks: string[] = []
    let inCodeBlock = false
    let codeBlockLang = ""
    let codeBuffer: string[] = []
    let listBuffer: { ordered: boolean; taskList: boolean; items: string[] } | null = null
    let quoteBuffer: string[] = []

    const flushList = () => {
        if (!listBuffer) return
        const tag = listBuffer.ordered ? "ol" : "ul"
        const attrs = listBuffer.taskList ? ' data-type="taskList"' : ""
        const items = listBuffer.items.map((item) => {
            if (listBuffer?.taskList) {
                const match = item.match(/^\s*\[([xX ])\]\s+(.*)$/)
                const checked = match?.[1]?.toLowerCase() === "x"
                const content = parseInlineMarkdown(match?.[2] || item)
                return `<li data-type="taskItem" data-checked="${checked}"><p>${content}</p></li>`
            }
            return `<li><p>${parseInlineMarkdown(item)}</p></li>`
        }).join("")
        blocks.push(`<${tag}${attrs}>${items}</${tag}>`)
        listBuffer = null
    }

    const flushQuote = () => {
        if (!quoteBuffer.length) return
        const content = quoteBuffer.map((line) => `<p>${parseInlineMarkdown(line)}</p>`).join("")
        blocks.push(`<blockquote>${content}</blockquote>`)
        quoteBuffer = []
    }

    const flushCode = () => {
        if (!inCodeBlock) return
        const code = escapeHtml(codeBuffer.join("\n"))
        const languageClass = codeBlockLang ? ` class="language-${codeBlockLang}"` : ""
        blocks.push(`<pre><code${languageClass}>${code}</code></pre>`)
        inCodeBlock = false
        codeBlockLang = ""
        codeBuffer = []
    }

    lines.forEach((line) => {
        const codeFenceMatch = line.match(/^```\s*(\w+)?\s*$/)
        if (codeFenceMatch) {
            if (inCodeBlock) {
                flushCode()
            } else {
                flushList()
                flushQuote()
                inCodeBlock = true
                codeBlockLang = codeFenceMatch[1] || ""
            }
            return
        }

        if (inCodeBlock) {
            codeBuffer.push(line)
            return
        }

        if (!line.trim()) {
            flushList()
            flushQuote()
            return
        }

        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/)
        if (headingMatch) {
            flushList()
            flushQuote()
            const level = headingMatch[1].length
            blocks.push(`<h${level}>${parseInlineMarkdown(headingMatch[2])}</h${level}>`)
            return
        }

        if (/^>\s?/.test(line)) {
            flushList()
            quoteBuffer.push(line.replace(/^>\s?/, ""))
            return
        }

        if (/^---+$/.test(line.trim())) {
            flushList()
            flushQuote()
            blocks.push("<hr />")
            return
        }

        const taskMatch = line.match(/^-\s+\[[xX ]\]\s+(.*)$/)
        if (taskMatch) {
            if (!listBuffer || !listBuffer.taskList) {
                flushList()
                listBuffer = { ordered: false, taskList: true, items: [] }
            }
            listBuffer.items.push(line.replace(/^-\s+/, ""))
            return
        }

        const unorderedMatch = line.match(/^(?:-|\*)\s+(.*)$/)
        if (unorderedMatch) {
            if (!listBuffer || listBuffer.ordered) {
                flushList()
                listBuffer = { ordered: false, taskList: false, items: [] }
            }
            listBuffer.items.push(unorderedMatch[1])
            return
        }

        const orderedMatch = line.match(/^\d+\.\s+(.*)$/)
        if (orderedMatch) {
            if (!listBuffer || !listBuffer.ordered) {
                flushList()
                listBuffer = { ordered: true, taskList: false, items: [] }
            }
            listBuffer.items.push(orderedMatch[1])
            return
        }

        flushList()
        flushQuote()
        blocks.push(`<p>${parseInlineMarkdown(line)}</p>`)
    })

    flushList()
    flushQuote()
    flushCode()

    return blocks.join("")
}

const serializeMarkdown = (editor: ReturnType<typeof useEditor>) => {
    if (!editor) return ""
    const fragments: string[] = []
    editor.state.doc.forEach((node) => {
        fragments.push(serializeBlock(node))
    })
    return fragments.join("\n\n").replace(/\n{3,}/g, "\n\n").trim()
}

const serializeInline = (node: any): string => {
    if (node.isText) {
        let text = node.text || ""
        if (node.marks?.length) {
            node.marks.forEach((mark: any) => {
                if (mark.type?.name === "bold") text = `**${text}**`
                if (mark.type?.name === "italic") text = `*${text}*`
                if (mark.type?.name === "strike") text = `~~${text}~~`
                if (mark.type?.name === "code") text = `\`${text}\``
                if (mark.type?.name === "link") {
                    const href = mark.attrs?.href || ""
                    text = href ? `[${text}](${href})` : text
                }
            })
        }
        return text
    }

    if (node.isTextblock || node.isInline) {
        let value = ""
        if (typeof node.forEach === "function") {
            node.forEach((child: any) => {
                value += serializeInline(child)
            })
        } else if (Array.isArray(node.content)) {
            value = node.content.map((child: any) => serializeInline(child)).join("")
        } else if (node.content?.content) {
            value = node.content.content.map((child: any) => serializeInline(child)).join("")
        }
        return value
    }

    if (node.type?.name === "image") {
        const src = node.attrs?.src || ""
        const alt = node.attrs?.alt || ""
        return src ? `![${alt}](${src})` : ""
    }

    return ""
}

const serializeList = (node: any, ordered: boolean) => {
    const items: string[] = []
    if (typeof node.forEach === "function") {
        let index = 0
        node.forEach((item: any) => {
            const prefix = ordered ? `${index + 1}. ` : "- "
            const content = serializeBlockChildren(item)
            items.push(`${prefix}${content}`)
            index += 1
        })
    } else if (Array.isArray(node.content)) {
        node.content.forEach((item: any, index: number) => {
            const prefix = ordered ? `${index + 1}. ` : "- "
            const content = serializeBlockChildren(item)
            items.push(`${prefix}${content}`)
        })
    } else if (node.content?.content) {
        node.content.content.forEach((item: any, index: number) => {
            const prefix = ordered ? `${index + 1}. ` : "- "
            const content = serializeBlockChildren(item)
            items.push(`${prefix}${content}`)
        })
    }
    return items.join("\n")
}

const serializeBlockChildren = (node: any) => {
    const fragments: string[] = []
    if (typeof node.forEach === "function") {
        node.forEach((child: any) => {
            fragments.push(serializeBlock(child))
        })
    } else if (Array.isArray(node.content)) {
        node.content.forEach((child: any) => {
            fragments.push(serializeBlock(child))
        })
    } else if (node.content?.content) {
        node.content.content.forEach((child: any) => {
            fragments.push(serializeBlock(child))
        })
    }
    return fragments.join("\n")
}

const serializeTaskList = (node: any) => {
    const items: string[] = []
    if (typeof node.forEach === "function") {
        node.forEach((item: any) => {
            const checked = item.attrs?.checked ? "x" : " "
            const content = serializeInline(item)
            items.push(`- [${checked}] ${content}`)
        })
    } else if (Array.isArray(node.content)) {
        node.content.forEach((item: any) => {
            const checked = item.attrs?.checked ? "x" : " "
            const content = serializeInline(item)
            items.push(`- [${checked}] ${content}`)
        })
    } else if (node.content?.content) {
        node.content.content.forEach((item: any) => {
            const checked = item.attrs?.checked ? "x" : " "
            const content = serializeInline(item)
            items.push(`- [${checked}] ${content}`)
        })
    }
    return items.join("\n")
}

const serializeBlock = (node: any): string => {
    switch (node.type?.name) {
        case "paragraph":
            return serializeInline(node).trim()
        case "heading":
            return `${"#".repeat(node.attrs?.level || 1)} ${serializeInline(node).trim()}`
        case "blockquote":
            return serializeInline(node).split("\n").map((line: string) => `> ${line}`).join("\n")
        case "codeBlock": {
            const lang = node.attrs?.language || ""
            const content = node.textContent || ""
            return `\n\n\`\`\` ${lang}\n${content}\n\`\`\`\n\n`.trim()
        }
        case "horizontalRule":
            return "---"
        case "bulletList":
            return serializeList(node, false)
        case "orderedList":
            return serializeList(node, true)
        case "taskList":
            return serializeTaskList(node)
        case "image":
            return serializeInline(node)
        default:
            return serializeInline(node)
    }
}


interface TipTapEditorProps {
    content: string
    onChange?: (content: string) => void
    editable?: boolean
}

export function TipTapEditor({ content, onChange, editable = true }: TipTapEditorProps) {
    const lastMarkdownRef = useRef(content)
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                paragraph: false,
                blockquote: false,
                codeBlock: false,
                horizontalRule: false,
            }),
            Paragraph,
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Blockquote,
            CodeBlock,
            HorizontalRule,

            Placeholder.configure({
                placeholder: "Type '/' to choose a block, or just start writing...",
                includeChildren: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 cursor-pointer',
                },
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'not-prose pl-2',
                },
            }),
            TaskItem.configure({
                nested: true,
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg border shadow-sm',
                },
            }),
            DragHandle.configure({
                render: () => {
                    const wrapper = document.createElement('div')
                    wrapper.classList.add('tiptap-drag-handle-group')

                    // Add Button
                    const addBtn = document.createElement('div')
                    addBtn.classList.add('add-block-btn')
                    addBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>'

                    addBtn.onmousedown = (e) => e.stopPropagation() // Prevent drag
                    addBtn.onclick = (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const rect = addBtn.getBoundingClientRect()
                        document.dispatchEvent(new CustomEvent('bmad-block-add', {
                            detail: { x: rect.left, y: rect.top + rect.height }
                        }))
                    }

                    // Drag Handle
                    const handle = document.createElement('div')
                    handle.setAttribute('data-drag-handle', 'true') // Helper for extension
                    handle.classList.add('tiptap-drag-handle')
                    handle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>'

                    handle.onclick = () => {
                        const rect = handle.getBoundingClientRect()
                        // Dispatch global event for React to pick up
                        document.dispatchEvent(new CustomEvent('bmad-block-menu', {
                            detail: { x: rect.left, y: rect.bottom + 5 }
                        }))
                    }

                    wrapper.appendChild(addBtn)
                    wrapper.appendChild(handle)

                    return wrapper
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            configureSlashCommand(),

        ],
        content: parseMarkdown(content),
        editable,
        onUpdate: ({ editor }) => {
            const markdown = serializeMarkdown(editor)
            lastMarkdownRef.current = markdown
            onChange?.(markdown)
        },

        editorProps: {
            attributes: {
                class: 'prose prose-stone dark:prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] py-4',
            },
        },
    })

    useEffect(() => {
        if (!editor) return
        if (content === lastMarkdownRef.current) return
        editor.commands.setContent(parseMarkdown(content), { emitUpdate: false })
        lastMarkdownRef.current = content
    }, [content, editor])

    if (!editor) {
        return null
    }

    return (
        <div className={cn("w-full transition-all relative", !editable && "opacity-80")}>
            <EditorBubbleMenu editor={editor} />
            <TableBubbleMenu editor={editor} />
            <TableControls editor={editor} />
            <EditorContent editor={editor} />
            <BlockMenuIntegration editor={editor} />
        </div>
    )
}


function BlockMenuIntegration({ editor }: { editor: any }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null)
    const [targetBlock, setTargetBlock] = useState<{ node: any, pos: number } | null>(null)

    useEffect(() => {
        const handleMenu = (e: any) => {
            const { x, y } = e.detail
            const result = editor.view.posAtCoords({ left: x + 50, top: y - 10 })
            if (result && result.pos !== null) {
                const resolved = editor.state.doc.resolve(result.pos)
                // Normalize to block depth if possible, usually 1 for top level
                // Or just use the resolved parent
                // If we are deep inside text, we want the block wrapper.
                // We'll walk up until we find a block node (not text)

                // Simple logic: Use depth 1 if available, else depth.
                // Actually resolved.node(1) is the top level block usually.
                const targetDepth = 1
                if (resolved.depth >= targetDepth) {
                    setTargetBlock({ node: resolved.node(targetDepth), pos: resolved.before(targetDepth) })
                } else {
                    setTargetBlock({ node: resolved.parent, pos: resolved.before(resolved.depth) })
                }

                setMenuPos({ x, y })
                setMenuOpen(true)
            }
        }

        const handleAdd = (e: any) => {
            const { x, y } = e.detail
            // Try to find which block we are next to
            const result = editor.view.posAtCoords({ left: x + 50, top: y + 10 })
            if (result) {
                const resolved = editor.state.doc.resolve(result.pos)
                // Insert paragraph after the current block (depth 1 usually)
                const targetDepth = 1
                let insertPos = resolved.end(targetDepth) + 1
                if (resolved.depth < targetDepth) insertPos = resolved.end(resolved.depth) + 1

                editor.chain()
                    .focus()
                    .insertContentAt(insertPos, { type: 'paragraph' })
                    .run()

                // Focus the new node
                // We can calculate new pos or just rely on insertContent setting selection? 
                // Tiptap insertContent usually sets selection to end of inserted content.
            }
        }

        document.addEventListener('bmad-block-menu', handleMenu)
        document.addEventListener('bmad-block-add', handleAdd)
        return () => {
            document.removeEventListener('bmad-block-menu', handleMenu)
            document.removeEventListener('bmad-block-add', handleAdd)
        }
    }, [editor])

    return (
        <BlockMenu
            editor={editor}
            isOpen={menuOpen}
            onOpenChange={setMenuOpen}
            position={menuPos}
            targetNode={targetBlock?.node}
            targetPos={targetBlock?.pos ?? null}
        />
    )
}
