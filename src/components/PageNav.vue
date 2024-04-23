<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
const { title } = defineProps<{ title: string }>()
const router = useRouter()
</script>

<template>
  <nav
    class="flex fixed top-0 w-full sm:sticky z-10 backdrop-blur-md items-center bg-background/50"
  >
    <a @click="router.go(-1)" class="p-4 hover:text-primary duration-300">
      <ChevronLeft :size="24" />
    </a>
    <div>
      <div class="font-bold text-lg">{{ title }}</div>
      <slot></slot>
    </div>
  </nav>
  <div class="h-14 sm:hidden"></div>
</template>
