import { useSeason } from "./useSeason"
import { useTemperature } from "./useTemperature"

const WEATHER_CODES = {
  SUN: 0,
  PARTLY_CLOUDY_1: 1,
  CLOUD: 2,
  PARTLY_CLOUDY_3: 3,
  FOG_45: 45,
  FOG_48: 48,
  DRIZZLE_51: 51,
  DRIZZLE_53: 53,
  DRIZZLE_55: 55,
  RAIN_61: 61,
  RAIN_63: 63,
  RAIN_65: 65,
  RAIN_SHOWERS_80: 80,
  RAIN_SHOWERS_81: 81,
  RAIN_SHOWERS_82: 82,
  SNOW_71: 71,
  SNOW_73: 73,
  SNOW_75: 75,
  SNOW_77: 77,
  SNOW_SHOWERS_85: 85,
  SNOW_SHOWERS_86: 86,
  THUNDERSTORM: 95,
  THUNDERSTORM_96: 96,
  THUNDERSTORM_99: 99,
} as const

const WEATHER_CODE_GROUPS = {
  sunny: [WEATHER_CODES.SUN] as const,
  cloudy: [
    WEATHER_CODES.PARTLY_CLOUDY_1,
    WEATHER_CODES.CLOUD,
    WEATHER_CODES.PARTLY_CLOUDY_3,
  ] as const,
  foggy: [
    WEATHER_CODES.FOG_45,
    WEATHER_CODES.FOG_48,
  ] as const,
  rainy: [
    WEATHER_CODES.DRIZZLE_51,
    WEATHER_CODES.DRIZZLE_53,
    WEATHER_CODES.DRIZZLE_55,
    WEATHER_CODES.RAIN_61,
    WEATHER_CODES.RAIN_63,
    WEATHER_CODES.RAIN_65,
    WEATHER_CODES.RAIN_SHOWERS_80,
    WEATHER_CODES.RAIN_SHOWERS_81,
    WEATHER_CODES.RAIN_SHOWERS_82,
  ] as const,
  snowy: [
    WEATHER_CODES.SNOW_71,
    WEATHER_CODES.SNOW_73,
    WEATHER_CODES.SNOW_75,
    WEATHER_CODES.SNOW_77,
    WEATHER_CODES.SNOW_SHOWERS_85,
    WEATHER_CODES.SNOW_SHOWERS_86,
  ] as const,
  stormy: [
    WEATHER_CODES.THUNDERSTORM,
    WEATHER_CODES.THUNDERSTORM_96,
    WEATHER_CODES.THUNDERSTORM_99,
  ] as const,
} as const

type WeatherCode = (typeof WEATHER_CODE_GROUPS)[keyof typeof WEATHER_CODE_GROUPS][number]

const codesInclude = (codes: readonly WeatherCode[], code: number): code is WeatherCode => {
  return codes.includes(code as WeatherCode)
}

export const useWeatherUI = () => {
  const { season } = useSeason()
  const {
    TEMPERATURE_LIMIT_VERY_COLD,
    TEMPERATURE_LIMIT_COLD,
    TEMPERATURE_LIMIT_MILD,
    TEMPERATURE_LIMIT_WARM,
  } = useTemperature()

  const weatherEmoji = (code: number): string => {
    if (codesInclude(WEATHER_CODE_GROUPS.sunny, code)) return "☀️"
    if (codesInclude(WEATHER_CODE_GROUPS.cloudy, code)) return "⛅"
    if (codesInclude(WEATHER_CODE_GROUPS.foggy, code)) return "🌫️"
    if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) return "🌧️"
    if (codesInclude(WEATHER_CODE_GROUPS.snowy, code)) return "❄️"
    if (codesInclude(WEATHER_CODE_GROUPS.stormy, code)) return "⛈️"
    return "❓"
  }

  const playfulWeatherText = (temp: number | undefined, code?: number): string => {
    if (temp === undefined) return ""

    // Texte basé sur température ET météo pour plus de richesse
    const isVeryFold = temp <= TEMPERATURE_LIMIT_VERY_COLD
    const isCold = temp <= TEMPERATURE_LIMIT_COLD
    const isMild = temp <= TEMPERATURE_LIMIT_MILD
    const isWarm = temp <= TEMPERATURE_LIMIT_WARM
    const isVeryHot = temp > TEMPERATURE_LIMIT_WARM

    // Si on a le code météo, créer des phrases plus contextuelles
    if (code !== undefined) {
      // Très froid
      if (isVeryFold) {
        if (codesInclude(WEATHER_CODE_GROUPS.snowy, code)) {
          return "Brrr, c'est la fête de la neige! 🎉❄️ Enfile ton plus gros manteau 🧥, tes gants 🧤 et ton bonnet 🎿!"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.foggy, code)) {
          return "Il fait froid et on y voit rien! 🌫️ Fais attention sur les routes! 🏃"
        }
        return "Brrrr! Il fait très froid dehors 🥶 Mets plein de vêtements! 🧥🧤"
      }

      // Froid
      if (isCold) {
        if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) {
          return "Il fait froid ET mouillé! 🌧️ L'imperméable, c'est ton meilleur ami! 🧥"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.snowy, code)) {
          return "Ouiii! La neige! ❄️ C'est parfait pour la luge et les batailles de boules! ⛷️"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.sunny, code)) {
          return "Froid mais du soleil! ☀️ Lance-toi dehors, ça réchauffe! 🏃"
        }
        return "Ça caille! 🥶 Prends ta veste et ton écharpe 🧣 et tu es prêt!"
      }

      // Doux
      if (isMild) {
        if (codesInclude(WEATHER_CODE_GROUPS.sunny, code)) {
          return "Il fait PARFAIT dehors! ☀️ Y'a du soleil et il fait doux! 👕 À toi de jouer! 🎮"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) {
          return "Il fait doux et mouillé? Jackpot! 🌧️ Les flaques t'attendent! 💦"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.cloudy, code)) {
          return "Il fait doux et nuageux ⛅ Bonne journée! 🌈"
        }
        return "Il fait la température idéale! 🙋 Une petite veste et c'est parfait!"
      }

      // Chaud
      if (isWarm) {
        if (codesInclude(WEATHER_CODE_GROUPS.sunny, code)) {
          return "Il fait chaud et beau! 🌞 Du soleil et de la chaleur! 🏃 Amuse-toi! 🌈"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) {
          return "Chaud et mouillé, comme une douche chaude dehors! 🌧️ C'est sympa non? 😄"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.stormy, code)) {
          return "Chaleur + orages = spectacle! ⛈️ Regarde par la fenêtre! ⚡"
        }
        return "Il fait chaud et super beau! ☀️ T-shirt et short! 🩳 Parfait pour s'amuser!"
      }

      // Très chaud
      if (isVeryHot) {
        if (codesInclude(WEATHER_CODE_GROUPS.sunny, code)) {
          return "Ohhhh c'est brûlant! 🔥☀️ Crème solaire obligatoire! 😎 Reste à l'ombre! 🏖️"
        }
        if (codesInclude(WEATHER_CODE_GROUPS.stormy, code)) {
          return "Il fait chaud et orageux! C'est fou dehors! ⛈️ 🌪️ Reste bien à l'abri! 🏠"
        }
        return "Il fait un vrai soleil d'été dehors! 🥵 Protège-toi bien! 🧴☀️"
      }
    }

    // Fallback: textes basés uniquement sur la température
    if (isVeryFold) return "Brrrr! Il gèle! 🥶 Habille-toi bien! 🧥"
    if (isCold) return "Il fait frais! 🧥 Prends ta veste et tu es prêt! 🧣"
    if (isMild) return "Il fait bon dehors! 👕 Une petite veste suffit! 🧥"
    if (isWarm) return "Il fait beau! ☀️ T-shirt et short! 🩳"
    return "Il fait chaud! 🔥 Mets une tenue légère! 😎"
  }

  const characterAnimation = (code: number): string => {
    const baseAnimation = (): string => {
      if (
        codesInclude(WEATHER_CODE_GROUPS.sunny, code) ||
        codesInclude(WEATHER_CODE_GROUPS.cloudy, code)
      )
        return "animate-sway-bounce"
      if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) return "animate-shake"
      if (codesInclude(WEATHER_CODE_GROUPS.snowy, code)) return "animate-shiver"
      if (codesInclude(WEATHER_CODE_GROUPS.stormy, code)) return "animate-shake-slow"
      return ""
    }

    const seasonSuffix = (): string => {
      // Ajouter des variantes saisonnières
      switch (season.value) {
        case "winter":
          return codesInclude(WEATHER_CODE_GROUPS.snowy, code) ? " scale-110" : ""
        case "spring":
          return codesInclude(WEATHER_CODE_GROUPS.rainy, code) ? " brightness-110" : ""
        case "summer":
          return codesInclude(WEATHER_CODE_GROUPS.sunny, code) ? " scale-105" : ""
        case "autumn":
          return codesInclude(WEATHER_CODE_GROUPS.rainy, code) ? " opacity-90" : ""
        default:
          return ""
      }
    }

    return `${baseAnimation()}${seasonSuffix()}`
  }

  const weatherAnimationClass = (code: number): string => {
    switch (code) {
      case WEATHER_CODES.SUN:
        return "animate-spin-slow"
      case WEATHER_CODES.CLOUD:
        return "animate-move-clouds"
      case WEATHER_CODES.DRIZZLE_51:
        return "animate-rain-smooth"
      case WEATHER_CODES.SNOW_71:
        return "animate-snow-smooth"
      case WEATHER_CODES.THUNDERSTORM:
        return "animate-thunder"
      default:
        return ""
    }
  }

  /**
   * Retourne une couleur RGB basée sur la température
   * Froid (-20°C) → Bleu glacier
   * Neutre (10°C) → Vert/Cyan
   * Chaud (30°C+) → Rouge/Orange
   */
  const temperatureToColor = (temp: number): string => {
    // Normaliser la température entre -20 et 50
    const MIN_TEMP = -20
    const MAX_TEMP = 50
    const COLD_RATIO_LIMIT = 0.33
    const MILD_RATIO_LIMIT = 0.66

    // Couleurs en RGB
    const COLD_START = {
      r: 6,
      g: 182,
      b: 212,
    }
    const COLD_END = {
      r: 14,
      g: 165,
      b: 233,
    }
    const MILD_START = {
      r: 14,
      g: 165,
      b: 233,
    }
    const MILD_END = {
      r: 251,
      g: 191,
      b: 36,
    }
    const WARM_START = {
      r: 251,
      g: 191,
      b: 36,
    }
    const WARM_END = {
      r: 239,
      g: 68,
      b: 68,
    }

    const normalized = Math.max(MIN_TEMP, Math.min(MAX_TEMP, temp))
    const ratio = (normalized - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)

    if (ratio < COLD_RATIO_LIMIT) {
      // Froid: Bleu glacier → Bleu ciel
      const t = ratio / COLD_RATIO_LIMIT
      const r = Math.round(COLD_START.r + (COLD_END.r - COLD_START.r) * t)
      const g = Math.round(COLD_START.g + (COLD_END.g - COLD_START.g) * t)
      const b = Math.round(COLD_START.b + (COLD_END.b - COLD_START.b) * t)
      return `rgb(${r}, ${g}, ${b})`
    } else if (ratio < MILD_RATIO_LIMIT) {
      // Doux: Bleu ciel → Ambre
      const t = (ratio - COLD_RATIO_LIMIT) / COLD_RATIO_LIMIT
      const r = Math.round(MILD_START.r + (MILD_END.r - MILD_START.r) * t)
      const g = Math.round(MILD_START.g + (MILD_END.g - MILD_START.g) * t)
      const b = Math.round(MILD_START.b + (MILD_END.b - MILD_START.b) * t)
      return `rgb(${r}, ${g}, ${b})`
    }
    // Chaud: Ambre → Rouge
    const t = (ratio - MILD_RATIO_LIMIT) / (1 - MILD_RATIO_LIMIT)
    const r = Math.round(WARM_START.r + (WARM_END.r - WARM_START.r) * t)
    const g = Math.round(WARM_START.g + (WARM_END.g - WARM_START.g) * t)
    const b = Math.round(WARM_START.b + (WARM_END.b - WARM_START.b) * t)
    return `rgb(${r}, ${g}, ${b})`
  }

  const clothingAdvice = (temp: number | undefined, code?: number): string => {
    if (temp === undefined || code === undefined) return ""

    const isVeryFold = temp <= TEMPERATURE_LIMIT_VERY_COLD
    const isCold = temp <= TEMPERATURE_LIMIT_COLD
    const isMild = temp <= TEMPERATURE_LIMIT_MILD
    const isWarm = temp <= TEMPERATURE_LIMIT_WARM
    const isVeryHot = temp > TEMPERATURE_LIMIT_WARM

    // Très froid
    if (isVeryFold) {
      if (codesInclude(WEATHER_CODE_GROUPS.snowy, code)) {
        return "🧥🎿"
      }
      return "🧥🧣"
    }

    // Froid
    if (isCold) {
      if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) {
        return "🧥☂️"
      }
      if (codesInclude(WEATHER_CODE_GROUPS.snowy, code)) {
        return "🧥🎿"
      }
      return "🧥🧢"
    }

    // Doux
    if (isMild) {
      if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) {
        return "☂️👟"
      }
      return "🧥"
    }

    // Chaud
    if (isWarm) {
      if (codesInclude(WEATHER_CODE_GROUPS.sunny, code)) {
        return "🧢☀️"
      }
      if (codesInclude(WEATHER_CODE_GROUPS.rainy, code)) {
        return "👕☂️"
      }
      return "👕🧢"
    }

    // Très chaud
    if (isVeryHot) {
      if (codesInclude(WEATHER_CODE_GROUPS.sunny, code)) {
        return "🧢☀️"
      }
      return "🩳☀️"
    }

    return ""
  }

  return {
    weatherEmoji,
    playfulWeatherText,
    characterAnimation,
    weatherAnimationClass,
    temperatureToColor,
    clothingAdvice,
  }
}
