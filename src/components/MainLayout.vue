<script setup lang="ts">
import { RouterView } from 'vue-router'
import SideNav from '@/components/SideNav.vue'
import SideFeed from '@/components/SideFeed.vue'
</script>

<template>
  <SideNav />
  <main class="flex flex-1 max-w-[600px] border-x-[1px] border-border">
    <RouterView />
  </main>
  <SideFeed />
</template>
