'use server'

import { signOut as signOut_func } from "@/lib/next-auth"

export const signOut = async () => await signOut_func()