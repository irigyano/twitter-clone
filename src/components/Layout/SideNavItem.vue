<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ location: string; title?: string }>()
</script>

<template>
  <RouterLink :to="location" class="flex">
    <div
      class="flex items-center hover:bg-secondary xl:px-4 px-2 py-2 rounded-full duration-300 hover:bg-opacity-50"
    >
      <slot></slot>
      <div v-if="title" class="pl-5 text-xl hidden xl:block">
        {{ title }}
      </div>
    </div>
  </RouterLink>
</template>
