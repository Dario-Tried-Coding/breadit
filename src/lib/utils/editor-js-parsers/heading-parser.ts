import { HeadingBlock } from "@/types/utils/editor-js";

export const headingParser = (block: HeadingBlock) => {
  return `<h${block.data.level} class=''>${block.data.text}</h${block.data.level}>`;
}