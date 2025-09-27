<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type WeatherData = {
  temperature: number
  weathercode: number
  morningTemp: number
  afternoonTemp: number
}

// --- Variables de base ---
const animals = ['🐱', '🐶', '🐊']
const selectedAnimal = ref<string | null>(null)
const weather = ref<WeatherData | null>(null)
const isLoading = ref(true)

// --- Saisons ---
const seasons: Array<'winter'|'spring'|'summer'|'autumn'> = ['winter','spring','summer','autumn']
const getSeason = () => {
  const month = new Date().getMonth()+1
  if([12,1,2].includes(month)) return 'winter'
  if([3,4,5].includes(month)) return 'spring'
  if([6,7,8].includes(month)) return 'summer'
  return 'autumn'
}
const season = ref(getSeason())

const seasonTheme = computed(() => {
  switch(season.value){
    case 'winter': return { emoji:'❄️', gradient:'from-blue-200 to-blue-500' }
    case 'spring': return { emoji:'🌸', gradient:'from-green-200 to-pink-300' }
    case 'summer': return { emoji:'☀️', gradient:'from-yellow-200 to-orange-300' }
    case 'autumn': return { emoji:'🍂', gradient:'from-orange-200 to-red-400' }
    default: return { emoji:'🌈', gradient:'from-gray-200 to-gray-400' }
  }
})

// --- Barre température ---
const temperatureScale = ['🥶','🧥','👕','🩳','🥵']
const temperatureBar = (temp:number|undefined)=>{
  if(temp===undefined) return 2
  if(temp<=0) return 0
  if(temp<=10) return 1
  if(temp<=20) return 2
  if(temp<=25) return 3
  return 4
}

// --- Météo ---
const weatherEmoji = (code:number)=>{
  if([0].includes(code)) return '☀️'
  if([1,2,3].includes(code)) return '⛅'
  if([45,48].includes(code)) return '🌫️'
  if([51,53,55,61,63,65,80,81,82].includes(code)) return '🌧️'
  if([71,73,75,77,85,86].includes(code)) return '❄️'
  if([95,96,99].includes(code)) return '⛈️'
  return '❓'
}

// Texte ludique selon température
const playfulWeatherText = (temp:number|undefined)=>{
  if(temp===undefined) return ''
  if(temp<=0) return 'Brrr, il fait très froid 🥶 ! Mets un gros manteau 🧥'
  if(temp<=10) return 'Il fait froid 🧥 ! N’oublie pas ton écharpe 🧣'
  if(temp<=20) return 'Il fait doux 👕 ! Une petite veste suffit 🧥'
  if(temp<=25) return 'Il fait chaud 👕 ! Short et t-shirt 🩳'
  return 'Il fait très chaud 🥵 ! Mets ton short et protège-toi ☀️'
}

// Couleur texte selon température
const temperatureColor = (temp:number|undefined)=>{
  if(temp===undefined) return 'text-gray-800'
  if(temp<=10) return 'text-blue-700'
  if(temp<=20) return 'text-green-700'
  if(temp<=25) return 'text-orange-600'
  return 'text-red-600'
}

// --- Animations personnage selon météo ---
const characterAnimation = (code:number)=>{
  if([0].includes(code)) return 'animate-sway-bounce'
  if([1,2,3].includes(code)) return 'animate-sway-bounce'
  if([51,53,55,61,63,65,80,81,82].includes(code)) return 'animate-shake'
  if([71,73,75,77,85,86].includes(code)) return 'animate-shiver'
  if([95,96,99].includes(code)) return 'animate-shake-slow'
  return ''
}

// --- TTS ---
const speakWeather = ()=>{
  if(!weather.value||!selectedAnimal.value) return
  const advice = playfulWeatherText(weather.value.temperature)
  const msg = new SpeechSynthesisUtterance(
    `Bonjour ! Je suis ton ami ${selectedAnimal.value}. Aujourd'hui ${advice}`
  )
  msg.lang='fr-FR'
  msg.pitch=1
  msg.rate=0.9
  window.speechSynthesis.speak(msg)
}

// --- Fetch météo Open-Meteo ---
const fetchWeather = async ()=>{
  try{
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=48.117&longitude=-1.677&current_weather=true&hourly=temperature_2m')
    const data = await res.json()
    const currentTemp = data.current_weather.temperature
    // Exemple pour matin et après-midi (8h et 15h)
    const morningTemp = data.hourly.temperature_2m[8] ?? currentTemp
    const afternoonTemp = data.hourly.temperature_2m[15] ?? currentTemp
    weather.value = {
      temperature: currentTemp,
      weathercode: data.current_weather.weathercode,
      morningTemp,
      afternoonTemp
    }
  }catch(e){ console.error(e) }
  finally{ isLoading.value=false }
}

// --- Debug : saisons + météo ---
const weatherCodes:number[]=[0,2,51,71,95] // Soleil, Nuage, Pluie, Neige, Orage
const nextSeasonAndWeather = ()=>{
  const currentIndex = seasons.indexOf(season.value as 'winter'|'spring'|'summer'|'autumn')
  season.value = seasons[(currentIndex+1)%seasons.length]
  if(!weather.value) weather.value={temperature:20,weathercode:0,morningTemp:15,afternoonTemp:20}
  const currentWeatherIndex = weatherCodes.indexOf(weather.value.weathercode)
  weather.value.weathercode = weatherCodes[(currentWeatherIndex+1)%weatherCodes.length]
  switch(weather.value.weathercode){
    case 0: weather.value.temperature=25; break
    case 2: weather.value.temperature=20; break
    case 51: weather.value.temperature=15; break
    case 71: weather.value.temperature=0; break
    case 95: weather.value.temperature=18; break
  }
}

// --- Emoji météo flottants ---
const weatherEmojis:Record<number,string[]> = {
  0:['☀️'], 2:['⛅','☁️'], 51:['🌧️','💧'], 71:['❄️'], 95:['⛈️','⚡']
}
const weatherAnimationClass = (code:number)=>{
  switch(code){
    case 0: return 'animate-spin-slow'
    case 2: return 'animate-move-clouds'
    case 51: return 'animate-rain-smooth'
    case 71: return 'animate-snow-smooth'
    case 95: return 'animate-thunder'
    default: return ''
  }
}

// --- Mounted ---
onMounted(()=>{
  fetchWeather()
  setTimeout(()=>{ speakWeather() },1000)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
       :class="`bg-gradient-to-b ${seasonTheme.gradient}`">

    <!-- Bouton debug -->
    <button class="absolute top-4 right-4 px-3 py-1 text-sm bg-yellow-300 rounded-full shadow button-interact z-20"
            @click="nextSeasonAndWeather">
      Debug saison/météo
    </button>

    <!-- Emoji saison flottants -->
    <div class="absolute inset-0 pointer-events-none">
      <span v-for="i in 12" :key="i"
            class="absolute opacity-10 animate-float"
            :style="{ top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, fontSize:`${80+Math.random()*60}px`, animationDuration:`${3+Math.random()*3}s` }">
        {{ seasonTheme.emoji }}
      </span>
    </div>

    <!-- Emoji météo dynamique -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <span v-for="(emoji,i) in weatherEmojis[weather?.weathercode||0]" :key="i"
            class="absolute"
            :class="weatherAnimationClass(weather?.weathercode||0)"
            :style="{ left:`${Math.random()*100}%`, top:`${Math.random()*-20}%`, fontSize:'2rem', animationDuration:`${2+Math.random()*3}s` }">
        {{ emoji }}
      </span>
    </div>

    <!-- Conteneur principal -->
    <div class="w-full max-w-md aspect-[9/16] bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-around p-6 relative z-10 overflow-hidden">
      <h1 class="text-2xl font-bold text-blue-800">🌤️ La météo des petits</h1>

      <div v-if="isLoading" class="text-blue-700">Chargement...</div>

      <div v-else-if="!selectedAnimal" class="flex-1 flex flex-col items-center justify-center gap-4">
        <p class="text-lg font-medium text-blue-800">Choisis ton ami :</p>
        <div class="flex gap-4 text-5xl">
          <button v-for="animal in animals" :key="animal"
                  class="hover:scale-125 transition-transform bg-white p-3 rounded-2xl shadow-lg button-interact"
                  @click="selectedAnimal=animal">{{ animal }}</button>
        </div>
      </div>

      <div v-else-if="weather" class="flex-1 flex flex-col items-center justify-center gap-2 w-full">
        <!-- GRAND EMOJI MÉTÉO -->
        <div class="text-center text-9xl mb-2 animate-pulse">
          {{ weatherEmoji(weather.weathercode) }}
        </div>

        <!-- TEXTE LUDIQUE -->
        <p :class="['text-center text-2xl font-bold mb-2', temperatureColor(weather.temperature)]">
          {{ playfulWeatherText(weather.temperature) }}
        </p>

        <!-- TEMPÉRATURE MATIN / APRÈS-MIDI -->
        <div class="flex justify-center gap-4 mb-4 text-sm text-gray-600 opacity-70">
          <span>🌅 Matin : {{ weather.morningTemp }}°C</span>
          <span>🌇 Après-midi : {{ weather.afternoonTemp }}°C</span>
        </div>

        <!-- LADDER TEMPÉRATURE -->
        <div class="flex justify-between items-center w-full max-w-xs mb-4">
          <span v-for="(emoji,index) in temperatureScale" :key="index"
                :class="{ 'animate-pulse-temp': index===temperatureBar(weather.temperature), 'opacity-50': index!==temperatureBar(weather.temperature) }"
                class="text-3xl transition-all">{{ emoji }}</span>
        </div>

        <!-- PERSONNAGE + TTS -->
        <button class="text-7xl focus:outline-none mt-2" @click="speakWeather"
                :class="characterAnimation(weather.weathercode)">
          {{ selectedAnimal }}
        </button>

        <button class="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-2xl shadow hover:bg-blue-600 transition button-interact"
                @click="speakWeather">
          🔊 Répète la météo
        </button>

      </div>

      <div class="text-sm text-gray-500 mt-2">Données météo via Open-Meteo</div>
    </div>
  </div>
</template>

<style scoped>
/* Animations flottantes saison */
@keyframes float {
  0% { transform: translateY(0) rotate(0deg);}
  25% { transform: translateY(-10px) rotate(5deg);}
  50% { transform: translateY(-20px) rotate(-5deg);}
  75% { transform: translateY(-10px) rotate(5deg);}
  100% { transform: translateY(0) rotate(0deg);}
}
.animate-float { animation: float infinite ease-in-out; }

/* Personnage doux */
@keyframes sway-bounce {
  0% { transform: translateY(0) rotate(-5deg);}
  25% { transform: translateY(-5px) rotate(5deg);}
  50% { transform: translateY(-10px) rotate(-2deg);}
  75% { transform: translateY(-5px) rotate(5deg);}
  100% { transform: translateY(0) rotate(-5deg);}
}
.animate-sway-bounce { animation: sway-bounce 2s infinite ease-in-out; }

/* Micro-interactions boutons */
.button-interact:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255,255,255,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Barres température pulsation */
@keyframes pulse-temp {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.animate-pulse-temp { animation: pulse-temp 1s infinite ease-in-out; }

/* Emoji météo amélioré */
@keyframes rain-smooth {0%{transform:translateY(-20%) rotate(0deg);opacity:0}50%{opacity:1}100%{transform:translateY(110%) rotate(10deg);opacity:0}}
.animate-rain-smooth { animation: rain-smooth linear infinite; }

@keyframes snow-smooth {0%{transform:translateY(-10%) rotate(0deg)}100%{transform:translateY(110%) rotate(360deg)}}
.animate-snow-smooth { animation: snow-smooth linear infinite; }

@keyframes move-clouds {0%{transform:translateX(-20%)}100%{transform:translateX(120%)}}
.animate-move-clouds { animation: move-clouds linear infinite; }
@keyframes thunder {0%,100%{opacity:1}50%{opacity:0.3}}
.animate-thunder { animation: thunder 0.5s infinite; }

/* Animations personnages météo */
@keyframes shake {0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.animate-shake { animation: shake 0.3s infinite; }
@keyframes shake-slow {0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.animate-shake-slow { animation: shake-slow 0.6s infinite; }
@keyframes shiver {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.animate-shiver { animation: shiver 0.3s infinite; }
@keyframes spin-slow {0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.animate-spin-slow { animation: spin-slow linear infinite; }
</style>
