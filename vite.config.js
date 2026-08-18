import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages -tuki:
//  - Käyttäjä-/organisaatiosivu (kuljetusjumppanen.github.io) -> base '/'
//  - Projektisivu (github.io/<repo>)                          -> base '/<repo>/'
//  - Oma verkkotunnus                                          -> base '/'
// Aseta tarvittaessa ympäristömuuttuja, esim. VITE_BASE=/kuljetus-jumppanen/
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2020',
    cssTarget: 'chrome80',
    sourcemap: false,
  },
})
