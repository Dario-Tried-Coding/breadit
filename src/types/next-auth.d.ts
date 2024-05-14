import { JWT } from 'next-auth/jwt'
import { User } from 'next-auth'

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string
  }
}

declare module 'next-auth' {
  interface User {
    username?: string
  }
}