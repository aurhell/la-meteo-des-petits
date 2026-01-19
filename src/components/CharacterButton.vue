<script setup lang="ts">
import { useWeatherUI } from "@/composables/useWeatherUI"

type Props = {
  animal: string | null;
  temperature: number | undefined;
  weatherCode: number;
  isSpeaking: boolean;
}

defineProps<Props>()

const emit = defineEmits<{
  speak: [];
}>()

const { characterAnimation } = useWeatherUI()

const handleClick = async(): Promise<void> => {
  emit("speak")
}
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <!-- PERSONNAGE INTERACTIF - TRÈS GRAND -->
    <button
      class="text-[120px] drop-shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none active:scale-95"
      :class="[
        characterAnimation(weatherCode),
        isSpeaking ? 'animate-pulse opacity-75' : 'cursor-pointer hover:drop-shadow-lg',
      ]"
      :disabled="isSpeaking"
      :title="`Clique sur ${animal} pour entendre la météo`"
      @click="handleClick"
    >
      {{ animal }}
    </button>

    <!-- BOUTON PRINCIPAL LUDIQUE -->
    <button
      class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="isSpeaking"
      @click="handleClick"
    >
      <span
        v-if="!isSpeaking"
        class="text-2xl"
      >🔊</span>
      <span
        v-else
        class="animate-spin text-2xl"
      >🎵</span>
      <span>{{ isSpeaking ? "Écoute..." : "Raconte!" }}</span>
    </button>

    <!-- INDICATEUR LUDIQUE DE PAROLE -->
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
</template>
