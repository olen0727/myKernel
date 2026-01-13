import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default mergeConfig(
    defineConfig({
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: 5173,
            host: true,
            fs: {
                allow: ['..']
            }
        },
    }),
    {
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/test/setup.ts',
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
        },
    }
)
