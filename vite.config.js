import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
 
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // This will redirect any requests to yourwebsite.com/api to the Express.js server
            "/api": {
                // The port you use here should match the "PORT" variable in your Express.js server
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
})