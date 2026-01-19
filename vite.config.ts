import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import vueDevTools from "vite-plugin-vue-devtools"

// Cache configuration constants
const CACHE_WEATHER_API_MAX_ENTRIES = 50
const CACHE_WEATHER_API_MAX_AGE_SECONDS = 3600 // 1 hour
const CACHE_GEOCODING_API_MAX_ENTRIES = 50
const CACHE_GEOCODING_API_MAX_AGE_SECONDS = 86400 // 24 hours
const CACHE_TTS_API_MAX_AGE_SECONDS = 3600 // 1 hour
const MAX_FILE_SIZE_TO_CACHE_BYTES = 3 * 1024 * 1024 // 3MB

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate", // met à jour auto le SW
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
      ],
      workbox: {
        // Stratégie de cache optimisée
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: MAX_FILE_SIZE_TO_CACHE_BYTES,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "weather-api",
              expiration: {
                maxEntries: CACHE_WEATHER_API_MAX_ENTRIES,
                maxAgeSeconds: CACHE_WEATHER_API_MAX_AGE_SECONDS,
              },
            },
          },
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\//,
            handler: "CacheFirst",
            options: {
              cacheName: "geocoding-api",
              expiration: {
                maxEntries: CACHE_GEOCODING_API_MAX_ENTRIES,
                maxAgeSeconds: CACHE_GEOCODING_API_MAX_AGE_SECONDS,
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.elevenlabs\.io\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "tts-api",
              expiration: {
                maxAgeSeconds: CACHE_TTS_API_MAX_AGE_SECONDS,
              },
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "La météo des petits",
        short_name: "MétéoPetits",
        description: "Un petit ami annonce la météo aux enfants ☀️🌧️❄️",
        theme_color: "#F97316",
        background_color: "#FED7AA",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Stratégie de code-splitting optimisée
    rollupOptions: {
      output: {
        manualChunks: {
          // Composables critiques dans le chunk principal
          weather: [
            "./src/composables/useWeather.ts",
            "./src/composables/useSeason.ts",
            "./src/composables/useWeatherUI.ts",
          ],
          // Composables non-critiques en chunks séparés
          notifications: ["./src/composables/useNotifications.ts"],
          tts: ["./src/composables/useTTS.ts"],
          temperature: ["./src/composables/useTemperature.ts"],
          // Composants de l'UI en chunk séparé
          components: [
            "./src/components/CharacterButton.vue",
            "./src/components/FriendSelector.vue",
            "./src/components/WeatherBackground.vue",
            "./src/components/WeatherDisplay.vue",
          ],
        },
      },
    },
    // Minification agressiva
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
