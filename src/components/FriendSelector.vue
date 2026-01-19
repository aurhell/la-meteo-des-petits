<script setup lang="ts">
import { FRIENDS } from "@/constants"

import type { Friend } from "@/types"

const emit = defineEmits<{
  "update:selectedFriend": [value: Friend];
}>()
</script>

<template>
  <div class="w-full text-center">
    <p class="mb-3 text-lg font-black text-gray-800">
      Choisis ton ami météo! 👇
    </p>
    <div class="flex w-full flex-wrap justify-center gap-2">
      <button
        v-for="(friend, index) in FRIENDS"
        :key="`friend-${index}`"
        class="group rounded-2xl border-2 border-orange-300 bg-gradient-to-b from-white to-gray-50 p-3 text-5xl shadow-md transition-all duration-200 hover:scale-110 hover:border-orange-500 hover:shadow-lg focus:outline-none active:scale-100"
        :title="`Choisis ${friend}`"
        @click="emit('update:selectedFriend', friend as Friend)"
      >
        <span class="inline-block group-hover:animate-bounce">
          {{ friend }}
        </span>
      </button>
    </div>
  </div>
</template>
