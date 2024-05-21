import { HeadingBlock, LinkBlock, TableBlock } from '@/types/utils/editor-js'

export const headingParser = (block: HeadingBlock) => {
  return `<h${block.data.level} class="mt-0">${block.data.text}</h${block.data.level}>`
}

export const linkParser = (block: LinkBlock) => {
  return `
  <div class="@container/link">
    <a href="${block.data.link}" class='group flex flex-col-reverse @lg/link:flex-row gap-2 @lg/link:gap-4 items-start border rounded-md p-4 @md/link:pb-6 @xl/link:p-6 no-underline'>
      <div class="flex-1">
        <h3 class="mt-4 mb-0 @md/link:m-0 leading-6 group-hover:underline">${block.data.meta.title}</h3>
        <p class="text-muted-foreground font-normal @md/link:mb-0">${block.data.meta.description}</p>
      </div>
      <img src="${block.data.meta.image.url}" alt="${block.data.meta.title}" class="@lg/link:w-36 object-cover rounded-lg m-0" />
    </a>
  </div>`
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
