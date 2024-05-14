import { OutputBlockData } from '@editorjs/editorjs'

export interface HeadingBlock extends OutputBlockData {
  type: 'header'
  data: {
    text: string
    level: 1 | 2 | 3 | 4 | 5 | 6
  }
}

export interface LinkBlock extends OutputBlockData {
  type: 'link'
  data: {
    link: string
    meta: {
      image: {
        url: string
      }
      title: string
      description: string
    }
  }
}

export interface TableBlock extends OutputBlockData {
  type: 'table'
  data: {
    content: string[][]
    withHeadings: boolean
  }
}