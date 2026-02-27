import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/nowhere_and_4ever/' : '/',
  plugins: [react()],
}))
