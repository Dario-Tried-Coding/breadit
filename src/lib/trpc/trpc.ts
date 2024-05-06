import { createTRPCReact } from '@trpc/react-query'

import type { AppRouter } from '@/lib/trpc/index'

export const trpc = createTRPCReact<AppRouter>()