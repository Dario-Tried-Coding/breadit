import { TableBlock } from '@/types/utils/editor-js'

export const tableParser = (block: TableBlock) => {
  const { content, withHeadings } = block.data

  function createTableHeadings() {
    if (withHeadings) {
      return `<thead>${content[0]
        .map((heading) => {
          return `<th>${heading}</th>`
        })
        .join('')}</thead>`
    }

    return null
  }
  function createTableBody() {
    if (withHeadings) {
      const rows = content
        .slice(1)
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
        .join('')
      return `<tbody>${rows}</tbody>`
    }

    const rows = content.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`)}</tr>`).join('')
    return `<tbody>${rows}</tbody>`
  }

  const table = `<table>${createTableHeadings()}${createTableBody()}</table>`

  return table
}
