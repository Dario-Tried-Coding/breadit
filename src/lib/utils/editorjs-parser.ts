import { HeadingBlock, LinkBlock, TableBlock } from '@/types/utils/editor-js'

export const headingParser = (block: HeadingBlock) => {
  return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`
}

export const linkParser = (block: LinkBlock) => {
  return `<p class='provaaaaa'>${block.data.meta.title}</p>`
}

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

    return ''
  }
  function createTableBody() {
    if (withHeadings) {
      const rows = content
        .slice(1)
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
        .join('')
      return `<tbody>${rows}</tbody>`
    }

    const rows = content.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')
    return `<tbody>${rows}</tbody>`
  }

  const table = `<table>${createTableHeadings()}${createTableBody()}</table>`

  return table
}
