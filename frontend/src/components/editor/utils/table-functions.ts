import { Editor } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'

export const moveRow = (editor: Editor, direction: 'up' | 'down') => {
    const { state, dispatch } = editor.view
    const { selection } = state

    // Find closest table
    let tableNode: Node | null = null
    let tablePos = -1

    // Simple search up
    const depth = selection.$from.depth
    for (let i = depth; i > 0; i--) {
        const node = selection.$from.node(i)
        if (node.type.name === 'table') {
            tableNode = node
            tablePos = selection.$from.start(i) - 1
            break
        }
    }

    if (!tableNode) return

    // Find current row index
    // Rely on finding 'tableRow' type
    let rowIndex = -1
    let rowPos = -1
    let rowNode: Node | null = null

    const resolvePos = state.doc.resolve(selection.from)
    // Check nodes along path
    for (let d = resolvePos.depth; d > 0; d--) {
        const node = resolvePos.node(d)
        if (node.type.name === 'tableRow') {
            rowIndex = resolvePos.index(d - 1)
            rowNode = node
            rowPos = resolvePos.before(d)
            break
        }
    }

    if (rowIndex === -1 || !rowNode) return

    const targetIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1
    if (targetIndex < 0 || targetIndex >= tableNode.childCount) return

    const tr = state.tr
    const targetRow = tableNode.child(targetIndex)
    const rowSize = rowNode.nodeSize

    tr.delete(rowPos, rowPos + rowSize)

    const rowNodeClone = rowNode.type.create(rowNode.attrs, rowNode.content, rowNode.marks)

    if (direction === 'up') {
        let insertPos = tablePos + 1
        for (let i = 0; i < targetIndex; i++) {
            insertPos += tableNode.child(i).nodeSize
        }
        tr.insert(insertPos, rowNodeClone)
    } else { // down
        tr.insert(rowPos + targetRow.nodeSize, rowNodeClone)
    }

    dispatch(tr)
}

export const moveColumn = (editor: Editor, direction: 'left' | 'right') => {
    const { state, dispatch } = editor.view
    const { selection } = state

    // Find table
    let tableNode: Node | null = null
    let tablePos = -1
    const depth = selection.$from.depth
    for (let i = depth; i > 0; i--) {
        const node = selection.$from.node(i)
        if (node.type.name === 'table') {
            tableNode = node
            tablePos = selection.$from.start(i) - 1
            break
        }
    }

    if (!tableNode) return

    // Find column index.
    const resolvePos = state.doc.resolve(selection.from)
    let colIndex = -1
    // Find 'tableCell' or 'tableHeader'
    for (let d = resolvePos.depth; d > 0; d--) {
        const node = resolvePos.node(d)
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
            colIndex = resolvePos.index(d - 1)
            break
        }
    }

    if (colIndex === -1) return

    const targetIndex = direction === 'left' ? colIndex - 1 : colIndex + 1

    if (targetIndex < 0) return
    if (tableNode.childCount > 0 && targetIndex >= tableNode.child(0).childCount) return

    const tr = state.tr

    const newRows: Node[] = []

    for (let i = 0; i < tableNode.childCount; i++) {
        const row = tableNode.child(i)
        if (colIndex >= row.childCount || targetIndex >= row.childCount) {
            newRows.push(row)
            continue
        }

        const cell = row.child(colIndex)
        const cells: Node[] = []
        row.forEach((c) => cells.push(c))

        cells.splice(colIndex, 1)
        cells.splice(targetIndex, 0, cell)

        const newRow = row.type.create(row.attrs, cells, row.marks)
        newRows.push(newRow)
    }

    const newTable = tableNode.type.create(tableNode.attrs, newRows, tableNode.marks)
    tr.replaceWith(tablePos, tablePos + tableNode.nodeSize, newTable)

    dispatch(tr)
}
