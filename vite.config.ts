import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      // Expose environment variables to the client
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
    }
  }
})
