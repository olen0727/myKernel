const escapeHtml = (value) => value
const parseInlineMarkdown = (value) => value

const parseMarkdown = (markdown) => {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n")
    const blocks = []
    let inCodeBlock = false
    let codeBlockLang = ""
    let codeBuffer = []
    let quoteBuffer = []

    let listStack = []
    let lastWasListItem = false

    const flushCode = () => { /*...*/ }
    const flushQuote = () => { /*...*/ }

    const closeListToIndent = (indent) => {
        while (listStack.length > 0 && listStack[listStack.length - 1].indent >= indent) {
            const popped = listStack.pop()
            if (lastWasListItem) {
                blocks.push(`</li>`)
                lastWasListItem = false
            }
            blocks.push(`</${popped.type === 'ol' ? 'ol' : 'ul'}>`)
        }
    }

    const closeAllLists = () => closeListToIndent(0)

    const openListIfNeeded = (indent, type) => {
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

                const popped = listStack.pop()
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
        if (!line.trim()) {
            closeAllLists()
            return
        }

        const spacesMatch = line.match(/^(\s*)/)
        const indent = spacesMatch ? spacesMatch[1].replace(/\t/g, "    ").length : 0
        const trimmed = line.trim()

        const taskMatch = trimmed.match(/^-\s+\[([xX ])\]\s+(.*)$/)
        if (taskMatch) {
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
            closeListToIndent(indent + 1)
            openListIfNeeded(indent, 'ul')

            if (lastWasListItem) blocks.push(`</li>`)

            blocks.push(`<li><p>${parseInlineMarkdown(unorderedMatch[1])}</p>`)
            lastWasListItem = true
            return
        }

        const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/)
        if (orderedMatch) {
            closeListToIndent(indent + 1)
            openListIfNeeded(indent, 'ol')

            if (lastWasListItem) blocks.push(`</li>`)

            blocks.push(`<li><p>${parseInlineMarkdown(orderedMatch[1])}</p>`)
            lastWasListItem = true
            return
        }

        closeAllLists()
        blocks.push(`<p>${parseInlineMarkdown(line)}</p>`)
    })

    closeAllLists()
    return blocks.join("")
}

console.log(parseMarkdown(`
1. parent
2. parent2
    - child
    - child2
        - grandchild
    - child3
3. parent3
`))
