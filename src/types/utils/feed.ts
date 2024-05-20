import { getFeedPosts } from "@/lib/helpers/models/posts";

export type ExtendedFeedPost = Awaited<ReturnType<typeof getFeedPosts>>['posts'][number]