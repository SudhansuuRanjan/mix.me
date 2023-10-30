import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // add this to cache all the imports
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: [
        "**/*",
      ],
      manifest: {
        "name": "🎧 Mix.Me",
        "short_name": "mix.me",
        "description": "A spotify client for users to view their Spotify listening history and stats.",
        "icons": [
          {
            "src": "\/favicons/android-icon-36x36.png",
            "sizes": "36x36",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "\/favicons/android-icon-48x48.png",
            "sizes": "48x48",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "\/favicons/android-icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "\/favicons/android-icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "\/favicons/android-icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "\/favicons/android-icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "\/favicons/music.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "start_url": "/",
        "id":"/",
        "display": "standalone",
        "theme_color": "#1DB954",
        "background_color": "#000000",
        "orientation": "portrait",
        "prefer_related_applications": true
      },
    })
  ],
})
