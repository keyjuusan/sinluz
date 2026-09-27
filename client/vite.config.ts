import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import {VitePWA} from "vite-plugin-pwa"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

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
  }
})
