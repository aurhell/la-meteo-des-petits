<script setup lang="ts">
import { computed } from "vue"

import { useWeatherUI } from "@/composables/useWeatherUI"

type SeasonType = "winter" | "spring" | "summer" | "autumn"

type Props = {
  season: SeasonType;
  weatherCode: number | undefined;
}

const PERCENT_MAX = 100
const EMOJI_MIN_SIZE = 80
const EMOJI_MAX_SIZE_RANGE = 60
const ANIMATION_DURATION_MIN = 3
const ANIMATION_DURATION_RANGE = 3

const WEATHER_EMOJI_TOP_OFFSET = -20
const WEATHER_EMOJI_SIZE = "2rem"
const WEATHER_ANIMATION_MIN = 2
const WEATHER_ANIMATION_RANGE = 3

const props = defineProps<Props>()

const SEASON_EMOJIS: Record<SeasonType, readonly string[]> = {
  winter: [
    "❄️",
    "⛄",
    "🔶",
  ],
  spring: [
    "🌸",
    "🌼",
    "🌺",
    "🐝",
  ],
  summer: [
    "☀️",
    "🌞",
    "🌻",
  ],
  autumn: [
    "🍂",
    "🍁",
    "🌰",
    "🦃",
  ],
} as const

const seasonBackgroundEmojisArray = computed(() => SEASON_EMOJIS[props.season])
const { weatherAnimationClass } = useWeatherUI()
</script>

<template>
  <!-- Emoji saison flottants -->
  <div class="pointer-events-none absolute inset-0">
    <span
      v-for="(emoji, i) in seasonBackgroundEmojisArray"
      :key="`${props.season}-${i}-${emoji}`"
      class="absolute animate-float opacity-10"
      :style="{
        top: `${Math.random() * PERCENT_MAX}%`,
        left: `${Math.random() * PERCENT_MAX}%`,
        fontSize: `${EMOJI_MIN_SIZE + Math.random() * EMOJI_MAX_SIZE_RANGE}px`,
        animationDuration: `${ANIMATION_DURATION_MIN + Math.random() * ANIMATION_DURATION_RANGE}s`,
      }"
    >
      {{ emoji }}
    </span>
  </div>

  <!-- Emoji météo dynamique -->
  <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <span
      v-for="(emoji, i) in seasonBackgroundEmojisArray"
      :key="`${props.season}-weather-${i}-${emoji}`"
      class="absolute"
      :class="weatherAnimationClass(weatherCode || 0)"
      :style="{
        left: `${Math.random() * PERCENT_MAX}%`,
        top: `${Math.random() * WEATHER_EMOJI_TOP_OFFSET}%`,
        fontSize: WEATHER_EMOJI_SIZE,
        animationDuration: `${WEATHER_ANIMATION_MIN + Math.random() * WEATHER_ANIMATION_RANGE}s`,
      }"
    >
      {{ emoji }}
    </span>
  </div>
</template>
