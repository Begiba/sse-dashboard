import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {    
    port: parseInt(process.env.VITE_PORT || 3313),
    strictPort: true,
    host: process.env.VITE_HOST || 'localhost',
    origin: "http://0.0.0.0:3313",
  }
})
