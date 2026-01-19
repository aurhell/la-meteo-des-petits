<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

import FriendSelector from "./components/FriendSelector.vue"
import WeatherBackground from "./components/WeatherBackground.vue"
import { useNotifications } from "./composables/useNotifications"
import { useSeason } from "./composables/useSeason"
import { useTTS } from "./composables/useTTS"
import { useWeather } from "./composables/useWeather"
import { useWeatherUI } from "./composables/useWeatherUI"

const CYCLE_INCREMENT = 1
const SPEAK_WEATHER_DELAY_MS = 1000
const WEATHER_CODE_SUN = 0
const WEATHER_CODE_CLOUD = 2
const WEATHER_CODE_RAIN = 51
const WEATHER_CODE_SNOW = 71
const WEATHER_CODE_THUNDER = 95

const WEATHER_CODE_CYCLE = [
  WEATHER_CODE_SUN,
  WEATHER_CODE_CLOUD,
  WEATHER_CODE_RAIN,
  WEATHER_CODE_SNOW,
  WEATHER_CODE_THUNDER,
] as const

const TEMP_SUN = 25
const TEMP_CLOUD = 20
const TEMP_RAIN = 15
const TEMP_SNOW = 0
const TEMP_THUNDER = 18
const TEMP_DEFAULT = 20

const TEMP_MAP: Record<number, number> = {
  [WEATHER_CODE_SUN]: TEMP_SUN,
  [WEATHER_CODE_CLOUD]: TEMP_CLOUD,
  [WEATHER_CODE_RAIN]: TEMP_RAIN,
  [WEATHER_CODE_SNOW]: TEMP_SNOW,
  [WEATHER_CODE_THUNDER]: TEMP_THUNDER,
}

const NOT_FOUND_INDEX = -1

const { season, seasonTheme, nextSeason } = useSeason()
const { weather, isLoading, lastUpdated, location, error, fetchWeather, requestGeolocation, clearError } = useWeather()
const { speak, isSpeaking, isLoading: isTTSLoading } = useTTS()
const { playfulWeatherText } = useWeatherUI()
const { permissionStatus, requestPermission, hasNotificationSupport, hasAskedForPermission } = useNotifications()

const selectedAnimal = ref<string | null>(null)

const showDebugButton = computed(() => {
  const debugEnv = import.meta.env.VITE_DEBUG_MODE
  if (debugEnv === "true") return true
  if (debugEnv === "false") return false
  return import.meta.env.DEV
})

const speakWeather = async(): Promise<void> => {
  if (!weather.value || !selectedAnimal.value) return
  const fullText = getFullWeatherText()
  await speak({
    text: fullText,
    animal: selectedAnimal.value,
  })
}

const getFullWeatherText = (): string => {
  if (!weather.value || !selectedAnimal.value) return ""
  const animalName = getAnimalName(selectedAnimal.value)
  const advice = playfulWeatherText(weather.value.temperature, weather.value.weathercode)
  return `Coucou c'est ${animalName}! ${advice}`
}

const resetSelection = (): void => {
  selectedAnimal.value = null
}

const getAnimalName = (emoji: string): string => {
  const animalNames: Record<string, string> = {
    "🐱": "Chat",
    "🐶": "Chien",
    "🐊": "Croco",
    "🦄": "Licorne magique",
    "🐸": "Grenouille",
    "🐭": "Souris",
    "🐰": "Lapin",
    "🦊": "Renard",
    "🐔": "Poule",
    "🕷️": "Araignée",
  }
  return animalNames[emoji] || emoji
}

const nextSeasonAndWeather = (): void => {
  nextSeason()

  if (!weather.value) {
    weather.value = {
      temperature: TEMP_DEFAULT,
      weathercode: WEATHER_CODE_SUN,
      morningTemp: TEMP_RAIN,
      afternoonTemp: TEMP_DEFAULT,
    }
  }

  const currentIndex = WEATHER_CODE_CYCLE.indexOf(weather.value.weathercode as typeof WEATHER_CODE_CYCLE[number])
  if (currentIndex !== NOT_FOUND_INDEX) {
    weather.value.weathercode = WEATHER_CODE_CYCLE[(currentIndex + CYCLE_INCREMENT) % WEATHER_CODE_CYCLE.length]
    weather.value.temperature = TEMP_MAP[weather.value.weathercode] ?? TEMP_DEFAULT
  }
}

const refreshWeather = async(): Promise<void> => {
  await fetchWeather(true)
}

const formatLastUpdated = (timestamp: number | null): string => {
  if (!timestamp) return "---"
  const date = new Date(timestamp)
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

onMounted((): void => {
  fetchWeather()
  setTimeout(() => {
    speakWeather()
  }, SPEAK_WEATHER_DELAY_MS)
})
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
    :class="`bg-gradient-to-b ${seasonTheme.gradient}`"
  >
    <!-- Debug button -->
    <button
      v-if="showDebugButton"
      class="absolute right-4 top-4 z-20 rounded-full bg-yellow-300 px-3 py-1 text-sm shadow transition-transform duration-200 hover:scale-110 hover:shadow-xl"
      @click="nextSeasonAndWeather"
    >
      Debug saison/météo
    </button>

    <!-- Animated backgrounds -->
    <WeatherBackground
      :season="season"
      :weather-code="weather?.weathercode"
    />

    <!-- Main container -->
    <div class="relative z-10 flex aspect-[9/16] w-full max-w-md flex-col items-center justify-between overflow-hidden rounded-3xl bg-white shadow-2xl">
      <!-- Header -->
      <div class="w-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 px-6 py-4 text-center text-white shadow-md">
        <h1 class="text-3xl font-black">
          🌤️ La météo des petits ☀️
        </h1>
      </div>

      <!-- Content area -->
      <div class="flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-8 sm:gap-6 sm:px-6">
        <!-- Loading state -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center gap-4"
        >
          <div class="size-20 animate-pulse rounded-full bg-gradient-to-r from-orange-200 to-pink-300" />
          <div class="text-center font-medium text-orange-600">
            Cherche la météo... ☀️
          </div>
        </div>

        <!-- Friend selector state -->
        <div
          v-else-if="!selectedAnimal"
          class="flex w-full flex-col items-center justify-center gap-6"
        >
          <FriendSelector @update:selected-friend="(friend) => { selectedAnimal = friend }" />
        </div>

        <!-- Weather display state -->
        <div
          v-else-if="weather"
          class="flex w-full flex-1 flex-col items-center justify-center gap-4"
        >
          <!-- Animal + Weather emoji side by side -->
          <div class="flex items-center justify-center gap-3 sm:gap-6">
            <!-- Animal -->
            <div class="animate-gentle-bounce text-6xl drop-shadow-xl sm:text-[120px]">
              {{ selectedAnimal }}
            </div>
            <!-- Weather emoji -->
            <div class="text-6xl drop-shadow-lg sm:text-[120px]">
              <span
                class="inline-block animate-gentle-bounce"
                style="animation-delay: 0.5s;"
              >
                {{ useWeatherUI().weatherEmoji(weather.weathercode) }}
              </span>
            </div>
          </div>

          <!-- Clothing advice emojis -->
          <div class="text-3xl sm:text-5xl">
            {{ useWeatherUI().clothingAdvice(weather.temperature, weather.weathercode) }}
          </div>

          <!-- Temperature -->
          <div
            class="text-4xl font-black leading-none transition-colors duration-500 sm:text-5xl"
            :style="{ color: useWeatherUI().temperatureToColor(weather.temperature) }"
          >
            {{ Math.round(weather.temperature) }}°
          </div>

          <!-- Temperatures matin/aprem -->
          <div class="text-xs font-bold text-gray-700">
            🌅 {{ weather.morningTemp }}° | 🌇 {{ weather.afternoonTemp }}°
          </div>

          <!-- Playful text -->
          <p class="text-xs font-bold text-purple-700 sm:text-sm">
            {{ getFullWeatherText() }}
          </p>

          <!-- Button to speak weather -->
          <button
            class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:text-base"
            :disabled="isSpeaking || isTTSLoading"
            @click="speakWeather"
          >
            <span
              v-if="!isSpeaking && !isTTSLoading"
              class="text-2xl"
            >🔊</span>
            <span
              v-else
              class="animate-spin text-2xl"
            >🎵</span>
            <span>{{ isSpeaking || isTTSLoading ? "Écoute..." : "Raconte!" }}</span>
          </button>

          <!-- Speaking indicator -->
          <div
            v-if="isSpeaking"
            class="flex items-center gap-2 text-sm"
          >
            <span class="inline-flex gap-0.5">
              <span class="size-2 animate-bounce rounded-full bg-purple-600" />
              <span
                class="size-2 animate-bounce rounded-full bg-purple-600"
                style="animation-delay: 0.2s"
              />
              <span
                class="size-2 animate-bounce rounded-full bg-purple-600"
                style="animation-delay: 0.4s"
              />
            </span>
            <span class="font-bold text-purple-600">Je parle...</span>
          </div>
        </div>
      </div>

      <!-- Footer - Simplified for kids -->
      <div class="w-full border-t-4 border-orange-200 bg-gradient-to-b from-orange-50 to-pink-50 px-6 py-4">
        <!-- Location -->
        <div class="mb-4 text-center">
          <div class="mb-1 text-3xl">
            📍
          </div>
          <div class="text-sm font-bold text-purple-700">
            {{ location?.city ?? "Quelque part..." }}
          </div>
        </div>

        <!-- Error message - More playful -->
        <div
          v-if="error"
          class="mb-3 w-full rounded-lg border-2 border-yellow-300 bg-yellow-100 px-3 py-2 text-sm font-bold text-yellow-800"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-lg">⚠️ Oups!</span> {{ error.message }}
              <div
                v-if="error.isRetrying"
                class="mt-1 text-xs text-yellow-700"
              >
                ⏳ On réessaye...
              </div>
            </div>
            <button
              class="flex-shrink-0 text-lg font-bold text-yellow-600 hover:text-yellow-800"
              @click="clearError"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Action buttons - Big and fun -->
        <div class="flex flex-wrap justify-center gap-2">
          <button
            :disabled="isLoading"
            class="rounded-2xl bg-gradient-to-r from-purple-400 to-purple-600 px-4 py-2 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            title="Rafraîchir"
            @click="refreshWeather"
          >
            🔄
          </button>
          <button
            :disabled="isLoading"
            class="rounded-2xl bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            title="Me localiser"
            @click="requestGeolocation"
          >
            📍
          </button>
          <button
            v-if="hasNotificationSupport() && permissionStatus !== 'granted' && !hasAskedForPermission()"
            class="rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 px-4 py-2 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            title="Alertes météo"
            @click="requestPermission"
          >
            🔔
          </button>
          <div
            v-if="hasNotificationSupport() && permissionStatus === 'granted'"
            class="rounded-2xl bg-gradient-to-r from-red-400 to-red-600 px-4 py-2 text-lg font-bold text-white shadow-lg"
            title="Alertes activées"
          >
            🔔
          </div>
          <button
            class="rounded-2xl bg-gradient-to-r from-indigo-400 to-indigo-600 px-4 py-2 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            title="Changer d'ami"
            @click="resetSelection"
          >
            👥
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
