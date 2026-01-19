import { ref } from "vue"

const ELEVENLABS_VOICE_STABILITY = 0.4
const ELEVENLABS_SIMILARITY_BOOST = 0.75

// Voix disponibles avec IDs ElevenLabs
const AVAILABLE_VOICES = {
  ELLI: {
    id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    gender: "female",
    type: "cartoon",
  }, // Féminin cartoon
  OLVIER: {
    id: "GFj5Qf6cNQ3Lgp8VKBwc",
    name: "Olivier",
    gender: "male",
    type: "cartoon",
  }, // Masculin cartoon
} as const

// Mappage des animaux à leurs caractéristiques (genre naturel)
const ANIMAL_VOICE_MAP: Record<string, keyof typeof AVAILABLE_VOICES> = {
  "🐱": "ELLI", // Minou - féminin (chat gracieux)
  "🐶": "OLVIER", // Rex - masculin (chien loyal)
  "🐊": "OLVIER", // Croco - masculin (animal fort)
  "🦄": "ELLI", // Licorne magique - féminin (mystérieux)
  "🐸": "OLVIER", // Grenouille - masculin (batracien)
  "🐭": "ELLI", // Souris - féminin (mignon)
  "🐰": "ELLI", // Lapin - féminin (doux)
  "🦊": "OLVIER", // Renard - masculin (rusé)
  "🐔": "ELLI", // Poule - féminin (poule)
  "🕷️": "OLVIER", // Araignée - masculin (arachnide)
} as const

const ELEVENLABS_CONFIG = {
  // En production, la clé API est gérée par Vercel (voir /api/tts.ts)
  // En développement, elle peut être utilisée directement (fallback)
  API_KEY: (import.meta as any).env.VITE_ELEVENLABS_API_KEY || "",
  // Voix par défaut (Elli - cartoon féminin)
  VOICE_ID: AVAILABLE_VOICES.ELLI.id,
  MODEL_ID: "eleven_turbo_v2_5",
  BASE_URL: "https://api.elevenlabs.io/v1/text-to-speech",
  // En production Vercel, utiliser l'API proxy local
  PROXY_URL: "/api/tts",
  VOICE_SETTINGS: {
    stability: ELEVENLABS_VOICE_STABILITY,
    similarity_boost: ELEVENLABS_SIMILARITY_BOOST,
  },
} as const

const WEB_SPEECH_PITCH = 1.1
const WEB_SPEECH_RATE = 0.85
const WEB_SPEECH_VOLUME = 1

const WEB_SPEECH_CONFIG = {
  LANG: "fr-FR",
  PITCH: WEB_SPEECH_PITCH,
  RATE: WEB_SPEECH_RATE,
  VOLUME: WEB_SPEECH_VOLUME,
} as const

type SpeakOptions = {
  text: string;
  animal?: string; // emoji de l'animal pour sélectionner la voix appropriée
  useElevenLabs?: boolean;
}

export const useTTS = () => {
  const isSpeaking = ref(false)
  const isLoading = ref(false)
  const audioCache = new Map<string, string>()

  // Sélectionner la voix selon l'animal
  const getVoiceForAnimal = (animal?: string): typeof AVAILABLE_VOICES[keyof typeof AVAILABLE_VOICES] => {
    if (!animal || !ANIMAL_VOICE_MAP[animal]) {
      return AVAILABLE_VOICES.ELLI // Voix par défaut
    }
    const voiceKey = ANIMAL_VOICE_MAP[animal]
    return AVAILABLE_VOICES[voiceKey]
  }

  const speak = async(options: SpeakOptions): Promise<void> => {
    const { text, animal, useElevenLabs = true } = options
    isLoading.value = true
    isSpeaking.value = true

    try {
      // Essayer ElevenLabs (API proxy en prod, direct en dev)
      if (useElevenLabs) {
        try {
          await speakWithElevenLabs(text, animal)
          return
        } catch (error) {
          console.warn("ElevenLabs failed, falling back to Web Speech API:", error)
        }
      }

      speakWithWebSpeech(text)
    } finally {
      isLoading.value = false
    }
  }

  const speakWithElevenLabs = async(text: string, animal?: string): Promise<void> => {
    const voice = getVoiceForAnimal(animal)

    // Check cache first
    if (audioCache.has(text)) {
      const cachedAudioUrl = audioCache.get(text)
      if (cachedAudioUrl) {
        const audio = new Audio(cachedAudioUrl)

        // Reset isSpeaking when audio finishes
        audio.onended = () => {
          isSpeaking.value = false
        }

        audio.play()
        return
      }
    }

    // Utiliser l'API proxy Vercel en production, ou l'API directe en développement
    const isProduction = (import.meta as any).env.PROD
    const apiUrl = isProduction && typeof window !== "undefined"
      ? ELEVENLABS_CONFIG.PROXY_URL
      : `${ELEVENLABS_CONFIG.BASE_URL}/${voice.id}`

    const requestBody = {
      text,
      ...(isProduction ? {} : {
        model_id: ELEVENLABS_CONFIG.MODEL_ID,
        voice_settings: ELEVENLABS_CONFIG.VOICE_SETTINGS,
      }),
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // En dev, ajouter la clé API si elle existe
    if (!isProduction && ELEVENLABS_CONFIG.API_KEY) {
      headers["xi-api-key"] = ELEVENLABS_CONFIG.API_KEY
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...requestBody,
        voiceId: ELEVENLABS_CONFIG.VOICE_ID,
      }),
    })

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    // Cache the audio URL
    audioCache.set(text, audioUrl)

    const audio = new Audio(audioUrl)

    // Reset isSpeaking when audio finishes
    audio.onended = () => {
      isSpeaking.value = false
    }

    audio.play()
  }

  const speakWithWebSpeech = (text: string): void => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    const msg = new SpeechSynthesisUtterance(text)
    msg.lang = WEB_SPEECH_CONFIG.LANG
    msg.pitch = WEB_SPEECH_CONFIG.PITCH
    msg.rate = WEB_SPEECH_CONFIG.RATE
    msg.volume = WEB_SPEECH_CONFIG.VOLUME

    const voices = window.speechSynthesis.getVoices()
    const frenchVoice =
      voices.find((v) => v.lang.includes("fr") && v.name.includes("female")) ??
      voices.find((v) => v.lang.includes("fr"))

    if (frenchVoice) {
      msg.voice = frenchVoice
    }

    // Reset isSpeaking when speech ends
    msg.onend = () => {
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(msg)
  }

  return {
    speak,
    isSpeaking,
    isLoading,
  }
}
