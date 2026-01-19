<script setup lang="ts">
import { useWeatherUI } from "@/composables/useWeatherUI"

import type { WeatherData } from "@/composables/useWeather"

type Props = {
  weather: WeatherData;
}

defineProps<Props>()

const { weatherEmoji, playfulWeatherText, temperatureToColor } = useWeatherUI()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-3">
    <!-- EMOJI MÉTÉO ANIMÉ -->
    <div class="relative z-0 text-6xl drop-shadow-lg">
      <span class="inline-block animate-gentle-bounce">
        {{ weatherEmoji(weather.weathercode) }}
      </span>
    </div>

    <!-- TEMPÉRATURE ACTUELLE + TEXTE -->
    <div class="text-center">
      <div
        class="text-5xl font-black leading-none transition-colors duration-500"
        :style="{ color: temperatureToColor(weather.temperature) }"
      >
        {{ Math.round(weather.temperature) }}°
      </div>
      <p class="text-sm font-bold leading-tight text-purple-700">
        {{ playfulWeatherText(weather.temperature) }}
      </p>
    </div>

    <!-- TEMPÉRATURE MATIN / APRÈS-MIDI - Inline et compact -->
    <div class="text-xs font-bold text-gray-700">
      🌅 {{ weather.morningTemp }}° | 🌇 {{ weather.afternoonTemp }}°
    </div>
  </div>
</template>
