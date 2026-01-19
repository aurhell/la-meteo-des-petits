import { computed, ref } from "vue"

const MONTH_OFFSET = 1
const SEASON_CYCLE_INCREMENT = 1

const MONTHS = {
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  DECEMBER: 12,
} as const

const MONTHS_BY_SEASON = {
  winter: [
    MONTHS.DECEMBER,
    MONTHS.JANUARY,
    MONTHS.FEBRUARY,
  ] as const,
  spring: [
    MONTHS.MARCH,
    MONTHS.APRIL,
    MONTHS.MAY,
  ] as const,
  summer: [
    MONTHS.JUNE,
    MONTHS.JULY,
    MONTHS.AUGUST,
  ] as const,
}

const SEASONS = [
  "winter",
  "spring",
  "summer",
  "autumn",
] as const
type SeasonType = (typeof SEASONS)[number]

type SeasonTheme = {
  emoji: string;
  gradient: string;
}

const SEASON_THEMES: Record<SeasonType, SeasonTheme> = {
  winter: {
    emoji: "❄️",
    gradient: "from-blue-200 to-blue-500",
  },
  spring: {
    emoji: "🌸",
    gradient: "from-green-200 to-pink-300",
  },
  summer: {
    emoji: "☀️",
    gradient: "from-yellow-200 to-orange-300",
  },
  autumn: {
    emoji: "🍂",
    gradient: "from-orange-200 to-red-400",
  },
}

const SEASON_BACKGROUND_EMOJIS: Record<SeasonType, readonly string[]> = {
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
}

const isMonthInSeason = (season: readonly number[], month: number): boolean => {
  return season.some((m) => m === month)
}

const getSeason = (): SeasonType => {
  const month = new Date().getMonth() + MONTH_OFFSET
  if (isMonthInSeason(MONTHS_BY_SEASON.winter, month)) return "winter"
  if (isMonthInSeason(MONTHS_BY_SEASON.spring, month)) return "spring"
  if (isMonthInSeason(MONTHS_BY_SEASON.summer, month)) return "summer"
  return "autumn"
}

export const useSeason = () => {
  const season = ref<SeasonType>(getSeason())

  const seasonTheme = computed(() => SEASON_THEMES[season.value])
  const seasonBackgroundEmojisArray = computed(() => SEASON_BACKGROUND_EMOJIS[season.value])

  const nextSeason = (): void => {
    const idx = SEASONS.indexOf(season.value)
    season.value = SEASONS[(idx + SEASON_CYCLE_INCREMENT) % SEASONS.length]
  }

  return {
    season,
    seasonTheme,
    seasonBackgroundEmojisArray,
    nextSeason,
  }
}
