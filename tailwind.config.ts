import type { Config } from 'tailwindcss'
import { themesPreset } from './src/lib/tailwind/presets'

const config = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [themesPreset],
} satisfies Config

export default config
