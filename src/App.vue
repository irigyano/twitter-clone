<script setup lang="ts">
import { RouterView } from 'vue-router'
import SideNav from '@/components/SideNav.vue'
import RightSideFeed from '@/components/RightSideFeed.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-800 text-gray-300 flex justify-center">
    <header class="hidden sm:flex flex-[0.25]">
      <SideNav />
    </header>
    <main class="flex flex-1 max-w-[600px]">
      <RouterView />
    </main>
    <footer class="hidden sm:flex flex-[0.25]">
      <RightSideFeed />
    </footer>
  </div>
</template>
