import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This securely injects the environment variable from the build environment (e.g., Netlify)
    // into the client-side code, making it available as process.env.API_KEY.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
