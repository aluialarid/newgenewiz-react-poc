import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // 1. Listen on the specific port Aspire assigns
        port: process.env.PORT ? Number(process.env.PORT) : 5173,
        strictPort: true,
        host: true,
        // 2. Proxy API calls to the backend service
        proxy: {
            '/api': {
                target: process.env.services__apiservice__https__0 || process.env.services__apiservice__http__0,
                changeOrigin: true,
                secure: false
            }
        }
    }
})