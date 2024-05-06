import type { Config } from 'tailwindcss'
import { shadcnPlugin } from './plugins/shadcn-ui'

export const themesPreset = {
  darkMode: ['class'],
  content: [],
  plugins: [shadcnPlugin],
} satisfies Config
