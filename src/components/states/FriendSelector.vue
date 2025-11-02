<script setup lang="ts">
import { FRIENDS } from "@/constants"

import type { Friend } from "@/types"

const emit = defineEmits<{
  "update:selectedFriend": [value: Friend]
}>()
</script>

<template>
  <p class="text-lg font-medium text-blue-800">
    Choisis ton ami :
  </p>
  <div class="flex w-full flex-wrap justify-center gap-4 text-5xl">
    <button
      v-for="(friend, index) in FRIENDS"
      :key="`friend-${index}`"
      class="flex-none rounded-2xl bg-white p-3 shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-xl"
      @click="emit('update:selectedFriend', friend as Friend)"
    >
      {{ friend }}
    </button>
  </div>
</template>
