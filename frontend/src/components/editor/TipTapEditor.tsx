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
import { Extension } from '@tiptap/core'



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
    let quoteBuffer: string[] = []

    let listStack: { indent: number, type: 'ul' | 'ol' | 'taskList' }[] = []
    let lastWasListItem = false

    const flushCode = () => {
        if (!inCodeBlock) return
        const code = escapeHtml(codeBuffer.join("\n"))
        const languageClass = codeBlockLang ? ` class="language-${codeBlockLang}"` : ""
        blocks.push(`<pre><code${languageClass}>${code}</code></pre>`)
        inCodeBlock = false
        codeBlockLang = ""
        codeBuffer = []
    }

    const flushQuote = () => {
        if (!quoteBuffer.length) return
        const content = quoteBuffer.map((line) => `<p>${parseInlineMarkdown(line)}</p>`).join("")
        blocks.push(`<blockquote>${content}</blockquote>`)
        quoteBuffer = []
    }

    const closeListToIndent = (indent: number) => {
        while (listStack.length > 0 && listStack[listStack.length - 1].indent >= indent) {
            const popped = listStack.pop()!
            if (lastWasListItem) {
                blocks.push(`</li>`)
                lastWasListItem = false
            }
            blocks.push(`</${popped.type === 'ol' ? 'ol' : 'ul'}>`)
        }
    }

    const closeAllLists = () => closeListToIndent(0)

    const openListIfNeeded = (indent: number, type: 'ul' | 'ol' | 'taskList') => {
        if (listStack.length > 0 && listStack[listStack.length - 1].indent > indent) {
            closeListToIndent(indent + 1)
        }

        const currentList = listStack.length > 0 ? listStack[listStack.length - 1] : null

        if (!currentList || currentList.indent < indent) {
            listStack.push({ indent, type })
            const attrs = type === 'taskList' ? ' data-type="taskList"' : ''
            const tag = type === 'ol' ? 'ol' : 'ul'
            blocks.push(`<${tag}${attrs}>`)
            lastWasListItem = false
            return true
        } else if (currentList.indent === indent) {
            if (currentList.type !== type) {
                closeListToIndent(indent + 1)
                if (lastWasListItem) { blocks.push(`</li>`); lastWasListItem = false }

                const popped = listStack.pop()!
                blocks.push(`</${popped.type === 'ol' ? 'ol' : 'ul'}>`)

                listStack.push({ indent, type })
                const attrs = type === 'taskList' ? ' data-type="taskList"' : ''
                const tag = type === 'ol' ? 'ol' : 'ul'
                blocks.push(`<${tag}${attrs}>`)
            }
            return false
        }
        return false
    }

    lines.forEach((line) => {
        const codeFenceMatch = line.match(/^```\s*(\w+)?\s*$/)
        if (codeFenceMatch) {
            if (inCodeBlock) {
                flushCode()
            } else {
                closeAllLists()
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
            closeAllLists()
            flushQuote()
            return
        }

        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/)
        if (headingMatch) {
            closeAllLists()
            flushQuote()
            const level = headingMatch[1].length
            blocks.push(`<h${level}>${parseInlineMarkdown(headingMatch[2])}</h${level}>`)
            return
        }

        if (/^>\s?/.test(line.trim())) {
            closeAllLists()
            quoteBuffer.push(line.replace(/^\s*>\s?/, ""))
            return
        }

        if (/^---+$/.test(line.trim())) {
            closeAllLists()
            flushQuote()
            blocks.push("<hr />")
            return
        }

        const spacesMatch = line.match(/^(\s*)/)
        const indent = spacesMatch ? spacesMatch[1].replace(/\t/g, "    ").length : 0
        const trimmed = line.trim()

        const taskMatch = trimmed.match(/^-\s+\[([xX ])\]\s+(.*)$/)
        if (taskMatch) {
            flushQuote()
            closeListToIndent(indent + 1)
            openListIfNeeded(indent, 'taskList')

            if (lastWasListItem) blocks.push(`</li>`)

            const checked = taskMatch[1].toLowerCase() === "x"
            blocks.push(`<li data-type="taskItem" data-checked="${checked}"><p>${parseInlineMarkdown(taskMatch[2])}</p>`)
            lastWasListItem = true
            return
        }

        const unorderedMatch = trimmed.match(/^(?:-|\*)\s+(.*)$/)
        if (unorderedMatch && !trimmed.startsWith("- [")) {
            flushQuote()
            closeListToIndent(indent + 1)
            openListIfNeeded(indent, 'ul')

            if (lastWasListItem) blocks.push(`</li>`)

            blocks.push(`<li><p>${parseInlineMarkdown(unorderedMatch[1])}</p>`)
            lastWasListItem = true
            return
        }

        const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/)
        if (orderedMatch) {
            flushQuote()
            closeListToIndent(indent + 1)
            openListIfNeeded(indent, 'ol')

            if (lastWasListItem) blocks.push(`</li>`)

            blocks.push(`<li><p>${parseInlineMarkdown(orderedMatch[1])}</p>`)
            lastWasListItem = true
            return
        }

        closeAllLists()
        flushQuote()
        blocks.push(`<p>${parseInlineMarkdown(line)}</p>`)
    })

    closeAllLists()
    flushCode()
    flushQuote()

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

const serializeList = (node: any, ordered: boolean, depth = 0) => {
    const items: string[] = []
    const indent = "  ".repeat(depth)

    const children = node.content?.content || node.content || []
    let index = 0
    const iterate = typeof node.forEach === "function" ? (cb: any) => node.forEach(cb) : (cb: any) => children.forEach(cb)

    iterate((item: any) => {
        const prefix = ordered ? `${index + 1}. ` : "- "

        let content = ""
        const itemChildren = item.content?.content || item.content || []
        const iterateItem = typeof item.forEach === "function" ? (cb: any) => item.forEach(cb) : (cb: any) => itemChildren.forEach(cb)

        iterateItem((child: any) => {
            if (child.type?.name === 'bulletList') {
                content += "\n" + serializeList(child, false, depth + 1)
            } else if (child.type?.name === 'orderedList') {
                content += "\n" + serializeList(child, true, depth + 1)
            } else if (child.type?.name === 'taskList') {
                content += "\n" + serializeTaskList(child, depth + 1)
            } else {
                const blockStr = serializeBlock(child)
                content += (content ? "\n" + indent + "  " : "") + blockStr
            }
        })
        items.push(`${indent}${prefix}${content.trimStart()}`)
        index += 1
    })
    return items.join("\n")
}

const serializeTaskList = (node: any, depth = 0) => {
    const items: string[] = []
    const indent = "  ".repeat(depth)

    const children = node.content?.content || node.content || []
    const iterate = typeof node.forEach === "function" ? (cb: any) => node.forEach(cb) : (cb: any) => children.forEach(cb)

    iterate((item: any) => {
        const checked = item.attrs?.checked ? "x" : " "

        let content = ""
        const itemChildren = item.content?.content || item.content || []
        const iterateItem = typeof item.forEach === "function" ? (cb: any) => item.forEach(cb) : (cb: any) => itemChildren.forEach(cb)

        iterateItem((child: any) => {
            if (child.type?.name === 'bulletList') {
                content += "\n" + serializeList(child, false, depth + 1)
            } else if (child.type?.name === 'orderedList') {
                content += "\n" + serializeList(child, true, depth + 1)
            } else if (child.type?.name === 'taskList') {
                content += "\n" + serializeTaskList(child, depth + 1)
            } else {
                const blockStr = serializeBlock(child)
                content += (content ? "\n" + indent + "  " : "") + blockStr
            }
        })
        items.push(`${indent}- [${checked}] ${content.trimStart()}`)
    })
    return items.join("\n")
}

const serializeBlockChildren = (node: any) => {
    const fragments: string[] = []
    const children = node.content?.content || node.content || []
    const iterate = typeof node.forEach === "function" ? (cb: any) => node.forEach(cb) : (cb: any) => children.forEach(cb)

    iterate((child: any) => {
        fragments.push(serializeBlock(child))
    })
    return fragments.join("\n")
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
            return serializeList(node, false, 0)
        case "orderedList":
            return serializeList(node, true, 0)
        case "taskList":
            return serializeTaskList(node, 0)
        case "image":
            return serializeInline(node)
        default:
            return serializeInline(node)
    }
}


const IndentListStyleHandler = Extension.create({
    name: 'indentListStyleHandler',
    addKeyboardShortcuts() {
        return {
            Tab: () => {
                if (this.editor.isActive('listItem')) {
                    const wasOrdered = this.editor.isActive('orderedList')
                    if (wasOrdered) {
                        return this.editor.chain()
                            .sinkListItem('listItem')
                            .toggleList('bulletList', 'listItem')
                            .run()
                    } else {
                        return this.editor.commands.sinkListItem('listItem')
                    }
                }
                if (this.editor.isActive('taskItem')) {
                    if (this.editor.commands.sinkListItem('taskItem')) return true
                }
                return false
            },
            'Shift-Tab': () => {
                if (this.editor.isActive('listItem')) {
                    if (this.editor.commands.liftListItem('listItem')) return true
                }
                if (this.editor.isActive('taskItem')) {
                    if (this.editor.commands.liftListItem('taskItem')) return true
                }
                return false
            }
        }
    }
})

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
                link: false,
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
            IndentListStyleHandler,

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
