
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: Define `process.env.API_KEY` to make the environment variable available in client-side code,
  // adhering to the Gemini API coding guidelines. The value is sourced from `VITE_API_KEY`.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  },
})
