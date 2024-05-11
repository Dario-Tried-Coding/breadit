import { OutputData } from "@editorjs/editorjs";
import { z } from "zod";

interface Content extends OutputData {
  [key: string]: any;
}

export const postCreationValidator = z.object({
  subredditId: z.string(),
  title: z.string().min(1).max(255),
  content: z.custom<Content>(),
})
export type PostCreationPayload = z.infer<typeof postCreationValidator>;