<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import monkaW from '@/assets/images/monkaW.webp'
import { cn } from '@/utils/shadcn'
defineProps<{
  avatar: string | null
  tag: string
  class?: HTMLAttributes['class']
  static?: boolean
}>()
</script>

<template>
  <RouterLink v-if="!static" @click.stop :to="`/${tag}`" class="inline-block">
    <img
      alt="avatar"
      :class="
        cn(
          `w-10 h-10 rounded-full object-cover duration-300 border-[1px] bg-background cursor-pointer hover:brightness-75`,
          $props.class
        )
      "
      width="40"
      height="40"
      :src="avatar || monkaW"
    />
  </RouterLink>

  <div v-if="static" class="inline-block">
    <img
      alt="avatar"
      :class="
        cn(
          `w-10 h-10 rounded-full object-cover duration-300 border-[1px] bg-background`,
          $props.class
        )
      "
      width="40"
      height="40"
      :src="avatar || monkaW"
    />
  </div>
</template>
