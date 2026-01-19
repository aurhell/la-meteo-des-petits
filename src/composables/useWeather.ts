import { ref } from "vue"

import { useNotifications } from "./useNotifications"

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast" as const
const GEOCODING_API_URL = "https://nominatim.openstreetmap.org/reverse" as const
const GEOLOCATION_TIMEOUT_MS = 10000
// eslint-disable-next-line no-magic-numbers
const CACHE_DURATION_MS = 30 * 60 * 1000 // 30 minutes
const STORAGE_KEY = "weather_cache"
const MAX_RETRY_ATTEMPTS = 3
const INITIAL_RETRY_DELAY_MS = 2000
const RETRY_BACKOFF_MULTIPLIER = 2

const DEFAULT_COORDS = {
  latitude: parseFloat((import.meta as any).env.VITE_DEFAULT_LATITUDE || "48.117"),
  longitude: parseFloat((import.meta as any).env.VITE_DEFAULT_LONGITUDE || "-1.677"),
} as const

const DEFAULTS = {
  MORNING_HOUR: 8,
  AFTERNOON_HOUR: 15,
  TEMPERATURE: 20,
  WEATHER_CODE: 0,
  MORNING_TEMP: 15,
  AFTERNOON_TEMP: 20,
} as const

export type WeatherData = {
  temperature: number;
  weathercode: number;
  morningTemp: number;
  afternoonTemp: number;
}

type GeolocationCoords = {
  latitude: number;
  longitude: number;
}

type LocationData = {
  city: string;
  coords: GeolocationCoords;
}

type NominatimResponse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
  };
}

type ApiResponse = {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  hourly: {
    temperature_2m: number[];
  };
}

type CachedWeatherData = {
  data: WeatherData;
  timestamp: number;
}

export type WeatherError = {
  code: string;
  message: string;
  isRetrying: boolean;
  retryCount: number;
}

const WEATHER_CODES_RAIN = [
  51,
  53,
  55,
  61,
  63,
  65,
  80,
  81,
  82,
]
const WEATHER_CODES_SNOW = [
  71,
  73,
  75,
  77,
  85,
  86,
]
const WEATHER_CODES_STORM = [
  95,
  96,
  99,
]

const isRainyWeather = (code: number): boolean => WEATHER_CODES_RAIN.includes(code)
const isSnowyWeather = (code: number): boolean => WEATHER_CODES_SNOW.includes(code)
const isStormyWeather = (code: number): boolean => WEATHER_CODES_STORM.includes(code)

const getCachedWeather = (): WeatherData | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) return null

    const parsed: CachedWeatherData = JSON.parse(cached)
    const age = Date.now() - parsed.timestamp

    if (age < CACHE_DURATION_MS) {
      return parsed.data
    }

    localStorage.removeItem(STORAGE_KEY)
    return null
  } catch (error) {
    console.warn("Failed to load weather cache:", error)
    return null
  }
}

const setCachedWeather = (data: WeatherData): void => {
  try {
    const cacheData: CachedWeatherData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData))
  } catch (error) {
    console.warn("Failed to save weather cache:", error)
  }
}

const getGeolocation = (): Promise<GeolocationCoords> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported, using default coordinates")
      resolve(DEFAULT_COORDS)
      return
    }

    const timeoutId = setTimeout(() => {
      console.warn("Geolocation timeout, using default coordinates")
      resolve(DEFAULT_COORDS)
    }, GEOLOCATION_TIMEOUT_MS)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId)
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        clearTimeout(timeoutId)
        console.warn(
          `Geolocation error (${error.code}): ${error.message}, using default coordinates`,
        )
        resolve(DEFAULT_COORDS)
      },
    )
  })
}

const getCityName = async(coords: GeolocationCoords): Promise<string> => {
  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
    )
    const data: NominatimResponse = await response.json()
    const city =
      data.address?.city ?? data.address?.town ?? data.address?.village ?? "Localisation"
    return city
  } catch (error) {
    console.warn("Failed to reverse geocode:", error)
    return "Localisation"
  }
}

export const useWeather = () => {
  const weather = ref<WeatherData | null>(null)
  const isLoading = ref(true)
  const lastUpdated = ref<number | null>(null)
  const location = ref<LocationData | null>(null)
  const error = ref<WeatherError | null>(null)
  const retryTimeoutId: ReturnType<typeof setTimeout> | null = null

  const clearError = (): void => {
    error.value = null
  }

  const setError = (code: string, message: string, isRetrying = false, retryCount = 0): void => {
    error.value = {
      code,
      message,
      isRetrying,
      retryCount,
    }
  }

  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const fetchWeatherWithRetry = async(
    coords: GeolocationCoords,
    attempt = 1,
  ): Promise<WeatherData | null> => {
    try {
      const url = `${WEATHER_API_URL}?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&hourly=temperature_2m`
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data: ApiResponse = await res.json()
      const currentTemp = data.current_weather.temperature
      const morningTemp = data.hourly.temperature_2m[DEFAULTS.MORNING_HOUR] ?? currentTemp
      const afternoonTemp = data.hourly.temperature_2m[DEFAULTS.AFTERNOON_HOUR] ?? currentTemp

      return {
        temperature: currentTemp,
        weathercode: data.current_weather.weathercode,
        morningTemp,
        afternoonTemp,
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur inconnue"

      if (attempt < MAX_RETRY_ATTEMPTS) {
        const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt - 1)
        setError("RETRY", `Tentative ${attempt + 1}/${MAX_RETRY_ATTEMPTS}...`, true, attempt)

        await sleep(delayMs)
        return fetchWeatherWithRetry(coords, attempt + 1)
      }

      setError("API_ERROR", `Météo indisponible. ${errorMsg}`, false, attempt)
      console.error("Weather API error after retries:", errorMsg)
      return null
    }
  }

  const fetchWeather = async(forceRefresh = false): Promise<void> => {
    try {
      clearError()
      // Essayer le cache d'abord si pas de force refresh
      if (!forceRefresh) {
        const cached = getCachedWeather()
        if (cached) {
          weather.value = cached
          lastUpdated.value = Date.now()
          isLoading.value = false
          return
        }
      }

      isLoading.value = true
      const coords = await getGeolocation()
      const city = await getCityName(coords)
      location.value = {
        city,
        coords,
      }

      const weatherData = await fetchWeatherWithRetry(coords)

      if (weatherData) {
        weather.value = weatherData
        setCachedWeather(weatherData)
        lastUpdated.value = Date.now()
        // Trigger notifications for extreme weather
        await checkAndNotify(weatherData)
      } else {
        // Fallback au cache même expiré
        const cachedFallback = localStorage.getItem(STORAGE_KEY)
        if (cachedFallback) {
          try {
            const parsed: CachedWeatherData = JSON.parse(cachedFallback)
            weather.value = parsed.data
            lastUpdated.value = parsed.timestamp
            setError(
              "STALE_CACHE",
              `Données du ${new Date(parsed.timestamp).toLocaleTimeString("fr-FR")}`,
              false,
              0,
            )
          } catch {
            // Cache corrompu
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch weather:", error)
      const message = error instanceof Error ? error.message : "Erreur inconnue"
      setError("NETWORK_ERROR", `Erreur réseau: ${message}`, false, 0)
    } finally {
      isLoading.value = false
      if (retryTimeoutId) clearTimeout(retryTimeoutId)
    }
  }

  const requestGeolocation = async(): Promise<void> => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported")
      return
    }
    // Force le navigateur à re-demander la permission
    await fetchWeather(true)
  }

  const setWeather = (newWeather: WeatherData): void => {
    weather.value = newWeather
  }

  const getDefaultWeather = (): WeatherData => ({
    temperature: DEFAULTS.TEMPERATURE,
    weathercode: DEFAULTS.WEATHER_CODE,
    morningTemp: DEFAULTS.MORNING_TEMP,
    afternoonTemp: DEFAULTS.AFTERNOON_TEMP,
  })

  const checkAndNotify = async(weatherData: WeatherData): Promise<void> => {
    const { showNotification } = useNotifications()

    if (isStormyWeather(weatherData.weathercode)) {
      await showNotification("storm")
    } else if (isSnowyWeather(weatherData.weathercode)) {
      await showNotification("snow")
    } else if (isRainyWeather(weatherData.weathercode)) {
      await showNotification("rain")
    }
  }

  return {
    weather,
    isLoading,
    lastUpdated,
    location,
    error,
    fetchWeather,
    requestGeolocation,
    setWeather,
    getDefaultWeather,
    clearError,
  }
}
