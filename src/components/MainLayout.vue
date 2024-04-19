<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import SideNav from '@/components/SideNav.vue'
import SideFeed from '@/components/SideFeed.vue'
const route = useRoute()
</script>

<template>
  <SideNav />
  <main class="flex flex-1 max-w-[600px] border-x-[1px] border-border">
    <!-- Potential performance issue -->
    <!-- https://stackoverflow.com/questions/69638667/vue-router-is-changing-the-url-but-not-re-rendering-the-component -->
    <RouterView :key="route.path" />
  </main>
  <SideFeed />
</template>
