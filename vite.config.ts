import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { gitPlugin } from './plugins/git.ts'
import { seoPlugin } from './plugins/seo.ts'

// BASE lets you deploy under a sub-path, e.g. BASE=/blog/ for user.github.io/blog
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react(), gitPlugin(import.meta.dirname, 'content/posts'), seoPlugin(import.meta.dirname)],
})
