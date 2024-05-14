import { LinkBlock } from "@/types/utils/editor-js"

export const linkParser = (block: LinkBlock) => {
  return `<p class='provaaaaa'>${block.data.meta.title}</p>`
}