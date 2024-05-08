import type { JWT } from '@auth/core/jwt'

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
  }
}