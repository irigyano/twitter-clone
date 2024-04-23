<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
const { title } = defineProps<{ title: string }>()
</script>

<template>
  <nav
    class="flex fixed top-0 w-full sm:sticky z-10 backdrop-blur-md items-center bg-background/50"
  >
    <RouterLink to="/" class="p-4 hover:text-primary duration-300">
      <ChevronLeft :size="24" />
    </RouterLink>
    <div>
      <div class="font-bold text-lg">{{ title }}</div>
      <slot></slot>
    </div>
  </nav>
  <div class="h-14 sm:hidden"></div>
</template>
