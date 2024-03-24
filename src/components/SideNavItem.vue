<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ location: string; title: string }>()
</script>

<template>
  <RouterLink :to="location">
    <div class="flex items-center">
      <slot></slot>
      <div class="pl-5 text-xl font-bold hidden xl:block">{{ title }}</div>
    </div>
  </RouterLink>
</template>
