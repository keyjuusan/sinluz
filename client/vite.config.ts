import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import {VitePWA} from "vite-plugin-pwa"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({registerType:"autoUpdate"})
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ["kind-islands-operational-superior.trycloudflare.com"]
  },
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
})
