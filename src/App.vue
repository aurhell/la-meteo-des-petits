<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

type WeatherData = {
  temperature: number
  weathercode: number
  morningTemp: number
  afternoonTemp: number
}

// --- Variables de base ---
const animals = [
  "🐱",
  "🐶",
  "🐊",
  "🦄",
]

// --- Magic numbers as constants ---
const MONTH_OFFSET = 1
const MORNING_HOUR_INDEX = 8
const AFTERNOON_HOUR_INDEX = 15
const DEFAULT_WEATHER_TEMPERATURE = 20
const DEFAULT_WEATHER_CODE = 0
const DEFAULT_MORNING_TEMP = 15
const DEFAULT_AFTERNOON_TEMP = 20
const WEATHER_CODE_SUN = 0
const WEATHER_CODE_CLOUD = 2
const WEATHER_CODE_RAIN = 51
const WEATHER_CODE_SNOW = 71
const WEATHER_CODE_THUNDER = 95
const TEMPERATURE_LIMIT_VERY_COLD = 0
const TEMPERATURE_LIMIT_COLD = 10
const TEMPERATURE_LIMIT_MILD = 20
const TEMPERATURE_LIMIT_WARM = 25
const TEMPERATURE_BAR_INDEX_VERY_COLD = 0
const TEMPERATURE_BAR_INDEX_COLD = 1
const TEMPERATURE_BAR_INDEX_MILD = 2
const TEMPERATURE_BAR_INDEX_WARM = 3
const TEMPERATURE_BAR_INDEX_HOT = 4
const DEFAULT_TEMPERATURE_BAR_INDEX = TEMPERATURE_BAR_INDEX_MILD
const selectedAnimal = ref<string | null>(null)
const weather = ref<WeatherData | null>(null)
const isLoading = ref(true)

// --- Saisons ---
const seasons: Array<"winter" | "spring" | "summer" | "autumn"> = [
  "winter",
  "spring",
  "summer",
  "autumn",
]

const JANUARY = 1
const FEBRUARY = 2
const MARCH = 3
const APRIL = 4
const MAY = 5
const JUNE = 6
const JULY = 7
const AUGUST = 8
const DECEMBER = 12

const MONTHS_NUMBER_WINTER = [
  DECEMBER,
  JANUARY,
  FEBRUARY,
]
const MONTHS_NUMBER_SPRING = [
  MARCH,
  APRIL,
  MAY,
]
const MONTHS_NUMBER_SUMMER = [
  JUNE,
  JULY,
  AUGUST,
]
const getSeason = () => {
  const month = new Date().getMonth() + MONTH_OFFSET
  if (MONTHS_NUMBER_WINTER.includes(month)) return "winter"
  if (MONTHS_NUMBER_SPRING.includes(month)) return "spring"
  if (MONTHS_NUMBER_SUMMER.includes(month)) return "summer"
  return "autumn"
}
const season = ref(getSeason())

const seasonTheme = computed(() => {
  switch (season.value) {
    case "winter": return {
      emoji: "❄️",
      gradient: "from-blue-200 to-blue-500",
    }
    case "spring": return {
      emoji: "🌸",
      gradient: "from-green-200 to-pink-300",
    }
    case "summer": return {
      emoji: "☀️",
      gradient: "from-yellow-200 to-orange-300",
    }
    case "autumn": return {
      emoji: "🍂",
      gradient: "from-orange-200 to-red-400",
    }
    default: return {
      emoji: "🌈",
      gradient: "from-gray-200 to-gray-400",
    }
  }
})

// --- Barre température ---
const temperatureScale = [
  "🥶",
  "🧥",
  "👕",
  "🩳",
  "🥵",
]
// (moved to top as TEMPERATURE_BAR_INDEX_MILD)
const WEATHER_CODE_PARTLY_CLOUDY_1 = 1
const WEATHER_CODE_PARTLY_CLOUDY_3 = 3
const WEATHER_CODE_FOG_45 = 45
const WEATHER_CODE_FOG_48 = 48
const WEATHER_CODE_RAIN_53 = 53
const WEATHER_CODE_RAIN_55 = 55
const WEATHER_CODE_RAIN_61 = 61
const WEATHER_CODE_RAIN_63 = 63
const WEATHER_CODE_RAIN_65 = 65
const WEATHER_CODE_RAIN_80 = 80
const WEATHER_CODE_RAIN_81 = 81
const WEATHER_CODE_RAIN_82 = 82
const WEATHER_CODE_SNOW_73 = 73
const WEATHER_CODE_SNOW_75 = 75
const WEATHER_CODE_SNOW_77 = 77
const WEATHER_CODE_SNOW_85 = 85
const WEATHER_CODE_SNOW_86 = 86
const WEATHER_CODE_THUNDER_96 = 96
const WEATHER_CODE_THUNDER_99 = 99
const temperatureBar = (temp:number | undefined)=>{
  if (temp === undefined) return DEFAULT_TEMPERATURE_BAR_INDEX
  if (temp <= TEMPERATURE_LIMIT_VERY_COLD) return TEMPERATURE_BAR_INDEX_VERY_COLD
  if (temp <= TEMPERATURE_LIMIT_COLD) return TEMPERATURE_BAR_INDEX_COLD
  if (temp <= TEMPERATURE_LIMIT_MILD) return TEMPERATURE_BAR_INDEX_MILD
  if (temp <= TEMPERATURE_LIMIT_WARM) return TEMPERATURE_BAR_INDEX_WARM
  return TEMPERATURE_BAR_INDEX_HOT
}

// --- Météo ---
const weatherEmoji = (code:number)=>{
  if ([WEATHER_CODE_SUN].includes(code)) return "☀️"
  if ([
    WEATHER_CODE_PARTLY_CLOUDY_1,
    WEATHER_CODE_CLOUD,
    WEATHER_CODE_PARTLY_CLOUDY_3,
  ].includes(code)) return "⛅"
  if ([
    WEATHER_CODE_FOG_45,
    WEATHER_CODE_FOG_48,
  ].includes(code)) return "🌫️"
  if ([
    WEATHER_CODE_RAIN,
    WEATHER_CODE_RAIN_53,
    WEATHER_CODE_RAIN_55,
    WEATHER_CODE_RAIN_61,
    WEATHER_CODE_RAIN_63,
    WEATHER_CODE_RAIN_65,
    WEATHER_CODE_RAIN_80,
    WEATHER_CODE_RAIN_81,
    WEATHER_CODE_RAIN_82,
  ].includes(code)) return "🌧️"
  if ([
    WEATHER_CODE_SNOW,
    WEATHER_CODE_SNOW_73,
    WEATHER_CODE_SNOW_75,
    WEATHER_CODE_SNOW_77,
    WEATHER_CODE_SNOW_85,
    WEATHER_CODE_SNOW_86,
  ].includes(code)) return "❄️"
  if ([
    WEATHER_CODE_THUNDER,
    WEATHER_CODE_THUNDER_96,
    WEATHER_CODE_THUNDER_99,
  ].includes(code)) return "⛈️"
  return "❓"
}

// Texte ludique selon température
const playfulWeatherText = (temp:number | undefined)=>{
  if (temp === undefined) return ""
  if (temp <= TEMPERATURE_LIMIT_VERY_COLD) return "Brrr, il fait très froid 🥶 ! Mets un gros manteau 🧥"
  if (temp <= TEMPERATURE_LIMIT_COLD) return "Il fait froid 🧥 ! N’oublie pas ton écharpe 🧣"
  if (temp <= TEMPERATURE_LIMIT_MILD) return "Il fait doux 👕 ! Une petite veste suffit 🧥"
  if (temp <= TEMPERATURE_LIMIT_WARM) return "Il fait chaud 👕 ! Short et t-shirt 🩳"
  return "Il fait très chaud 🥵 ! Mets ton short et protège-toi ☀️"
}

// Couleur texte selon température
const temperatureColor = (temp:number | undefined)=>{
  if (temp === undefined) return "text-gray-800"
  if (temp <= TEMPERATURE_LIMIT_COLD) return "text-blue-700"
  if (temp <= TEMPERATURE_LIMIT_MILD) return "text-green-700"
  if (temp <= TEMPERATURE_LIMIT_WARM) return "text-orange-600"
  return "text-red-600"
}

// --- Animations personnage selon météo ---
const characterAnimation = (code:number)=>{
  if ([WEATHER_CODE_SUN].includes(code)) return "animate-sway-bounce"
  if ([
    WEATHER_CODE_PARTLY_CLOUDY_1,
    WEATHER_CODE_CLOUD,
    WEATHER_CODE_PARTLY_CLOUDY_3,
  ].includes(code)) return "animate-sway-bounce"
  if ([
    WEATHER_CODE_RAIN,
    WEATHER_CODE_RAIN_53,
    WEATHER_CODE_RAIN_55,
    WEATHER_CODE_RAIN_61,
    WEATHER_CODE_RAIN_63,
    WEATHER_CODE_RAIN_65,
    WEATHER_CODE_RAIN_80,
    WEATHER_CODE_RAIN_81,
    WEATHER_CODE_RAIN_82,
  ].includes(code)) return "animate-shake"
  if ([
    WEATHER_CODE_SNOW,
    WEATHER_CODE_SNOW_73,
    WEATHER_CODE_SNOW_75,
    WEATHER_CODE_SNOW_77,
    WEATHER_CODE_SNOW_85,
    WEATHER_CODE_SNOW_86,
  ].includes(code)) return "animate-shiver"
  if ([
    WEATHER_CODE_THUNDER,
    WEATHER_CODE_THUNDER_96,
    WEATHER_CODE_THUNDER_99,
  ].includes(code)) return "animate-shake-slow"
  return ""
}

// --- TTS ---
const speakWeather = ()=>{
  if (!weather.value || !selectedAnimal.value) return
  const advice = playfulWeatherText(weather.value.temperature)
  const msg = new SpeechSynthesisUtterance(
    `Bonjour ! Je suis ton ami ${selectedAnimal.value}. Aujourd'hui ${advice}`,
  )
  msg.lang = "fr-FR"
  msg.pitch = 1
  msg.rate = 0.9
  window.speechSynthesis.speak(msg)
}

// --- Fetch météo Open-Meteo ---
const fetchWeather = async()=>{
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=48.117&longitude=-1.677&current_weather=true&hourly=temperature_2m")
    const data = await res.json()
    const currentTemp = data.current_weather.temperature
    // Exemple pour matin et après-midi (8h et 15h)
    const morningTemp = data.hourly.temperature_2m[MORNING_HOUR_INDEX] ?? currentTemp
    const afternoonTemp = data.hourly.temperature_2m[AFTERNOON_HOUR_INDEX] ?? currentTemp
    weather.value = {
      temperature: currentTemp,
      weathercode: data.current_weather.weathercode,
      morningTemp,
      afternoonTemp,
    }
  } catch (e) { console.error(e) } finally { isLoading.value = false }
}

// --- Debug : saisons + météo ---
const weatherCodes:number[] = [
  WEATHER_CODE_SUN,
  WEATHER_CODE_CLOUD,
  WEATHER_CODE_RAIN,
  WEATHER_CODE_SNOW,
  WEATHER_CODE_THUNDER,
] // Soleil, Nuage, Pluie, Neige, Orage
const nextSeasonAndWeather = ()=>{
  const currentIndex = seasons.indexOf(season.value as "winter" | "spring" | "summer" | "autumn")
  season.value = seasons[(currentIndex + 1) % seasons.length]
  if (!weather.value) weather.value = {
    temperature: DEFAULT_WEATHER_TEMPERATURE,
    weathercode: DEFAULT_WEATHER_CODE,
    morningTemp: DEFAULT_MORNING_TEMP,
    afternoonTemp: DEFAULT_AFTERNOON_TEMP,
  }
  const currentWeatherIndex = weatherCodes.indexOf(weather.value.weathercode)
  weather.value.weathercode = weatherCodes[(currentWeatherIndex + 1) % weatherCodes.length]
  switch (weather.value.weathercode) {
    case WEATHER_CODE_SUN: weather.value.temperature = 25; break
    case WEATHER_CODE_CLOUD: weather.value.temperature = 20; break
    case WEATHER_CODE_RAIN: weather.value.temperature = 15; break
    case WEATHER_CODE_SNOW: weather.value.temperature = 0; break
    case WEATHER_CODE_THUNDER: weather.value.temperature = 18; break
  }
}

// --- Emoji météo flottants ---
const weatherEmojis:Record<number, string[]> = {
  [WEATHER_CODE_SUN]: ["☀️"],
  [WEATHER_CODE_CLOUD]: [
    "⛅",
    "☁️",
  ],
  [WEATHER_CODE_RAIN]: [
    "🌧️",
    "💧",
  ],
  [WEATHER_CODE_SNOW]: ["❄️"],
  [WEATHER_CODE_THUNDER]: [
    "⛈️",
    "⚡",
  ],
}
const weatherAnimationClass = (code:number)=>{
  switch (code) {
    case WEATHER_CODE_SUN: return "animate-spin-slow"
    case WEATHER_CODE_CLOUD: return "animate-move-clouds"
    case WEATHER_CODE_RAIN: return "animate-rain-smooth"
    case WEATHER_CODE_SNOW: return "animate-snow-smooth"
    case WEATHER_CODE_THUNDER: return "animate-thunder"
    default: return ""
  }
}

// --- Mounted ---
const SPEAK_WEATHER_DELAY_MS = 1000
onMounted(()=>{
  fetchWeather()
  setTimeout(()=>{ speakWeather() }, SPEAK_WEATHER_DELAY_MS)
})
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
    :class="`bg-gradient-to-b ${seasonTheme.gradient}`"
  >
    <!-- Bouton debug -->
    <button
      class="absolute right-4 top-4 z-20 rounded-full bg-yellow-300 px-3 py-1 text-sm shadow transition-transform duration-200 hover:scale-110 hover:shadow-xl"
      @click="nextSeasonAndWeather"
    >
      Debug saison/météo
    </button>

    <!-- Emoji saison flottants -->
    <div class="pointer-events-none absolute inset-0">
      <span
        v-for="i in 12"
        :key="i"
        class="absolute animate-float opacity-10"
        :style="{ top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, fontSize:`${80+Math.random()*60}px`, animationDuration:`${3+Math.random()*3}s` }"
      >
        {{ seasonTheme.emoji }}
      </span>
    </div>

    <!-- Emoji météo dynamique -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <span
        v-for="(emoji,i) in weatherEmojis[weather?.weathercode||0]"
        :key="i"
        class="absolute"
        :class="weatherAnimationClass(weather?.weathercode||0)"
        :style="{ left:`${Math.random()*100}%`, top:`${Math.random()*-20}%`, fontSize:'2rem', animationDuration:`${2+Math.random()*3}s` }"
      >
        {{ emoji }}
      </span>
    </div>

    <!-- Conteneur principal -->
    <div class="relative z-10 flex aspect-[9/16] w-full max-w-md flex-col items-center justify-around overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
      <h1 class="text-2xl font-bold text-blue-800">
        🌤️ La météo des petits
      </h1>

      <div
        v-if="isLoading"
        class="text-blue-700"
      >
        Chargement...
      </div>

      <div
        v-else-if="!selectedAnimal"
        class="flex flex-1 flex-col items-center justify-center gap-4"
      >
        <p class="text-lg font-medium text-blue-800">
          Choisis ton ami :
        </p>
        <div class="flex gap-4 text-5xl">
          <button
            v-for="animal in animals"
            :key="animal"
            class="rounded-2xl bg-white p-3 shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-xl"
            @click="selectedAnimal=animal"
          >
            {{ animal }}
          </button>
        </div>
      </div>

      <div
        v-else-if="weather"
        class="flex w-full flex-1 flex-col items-center justify-center gap-2"
      >
        <!-- GRAND EMOJI MÉTÉO -->
        <div class="mb-2 animate-pulse text-center text-9xl">
          {{ weatherEmoji(weather.weathercode) }}
        </div>

        <!-- TEXTE LUDIQUE -->
        <p :class="['mb-2 text-center text-2xl font-bold', temperatureColor(weather.temperature)]">
          {{ playfulWeatherText(weather.temperature) }}
        </p>

        <!-- TEMPÉRATURE MATIN / APRÈS-MIDI -->
        <div class="mb-4 flex justify-center gap-4 text-sm text-gray-600 opacity-70">
          <span>🌅 Matin : {{ weather.morningTemp }}°C</span>
          <span>🌇 Après-midi : {{ weather.afternoonTemp }}°C</span>
        </div>

        <!-- LADDER TEMPÉRATURE -->
        <div class="mb-4 flex w-full max-w-xs items-center justify-between">
          <span
            v-for="(emoji,index) in temperatureScale"
            :key="index"
            :class="{ 'animate-pulse-temp': index===temperatureBar(weather.temperature), 'opacity-50': index!==temperatureBar(weather.temperature) }"
            class="text-3xl transition-all"
          >{{ emoji }}</span>
        </div>

        <!-- PERSONNAGE + TTS -->
        <button
          class="mt-2 text-7xl focus:outline-none"
          :class="characterAnimation(weather.weathercode)"
          @click="speakWeather"
        >
          {{ selectedAnimal }}
        </button>

        <button
          class="mt-4 rounded-2xl bg-blue-500 px-6 py-2 font-bold text-white shadow transition-transform duration-200 hover:scale-110 hover:bg-blue-600 hover:shadow-xl"
          @click="speakWeather"
        >
          🔊 Répète la météo
        </button>
      </div>

      <div class="mt-2 text-sm text-gray-500">
        Données météo via Open-Meteo
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
