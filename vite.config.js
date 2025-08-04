import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// configure PWA plugin 
import { VitePWA } from 'vite-plugin-pwa';





const vitePWAConfig = {
  registerType: 'autoUpdate', 
  devOptions: {
    enabled: false,
    type: 'module', // Use module type for service worker
  },
    workbox: {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true
  },


  manifest: {
      lang: 'fr-FR',
      orientation: 'portrait',
      name: 'Recouverement',
      short_name: 'Recouverement',
      description: 'Diardzair Recouverement app',
      theme_color: '#e6212a',
      background_color: '#e6212a',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/diardzair png.png',
          sizes: 'any',
          type: 'image/png',
          purpose: 'any maskable'
        },
      ]}
}





// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(vitePWAConfig),
  ],
  server: {
    host: '0.0.0.0', // This makes it accessible from your local network
    port: 2000, // Change to your desired port
  },
  build: {
    host: '0.0.0.0',
    port: 2000,
  }

})
