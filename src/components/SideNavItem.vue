<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ location: string; title: string }>()
</script>

<template>
  <RouterLink :to="location" class="flex">
    <div
      class="flex items-center hover:bg-gray-400 py-2 px-4 rounded-full duration-300 hover:bg-opacity-50"
    >
      <slot></slot>
      <div class="pl-5 text-xl font-bold hidden xl:block">{{ title }}</div>
    </div>
  </RouterLink>
</template>
