<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-slate-800 text-gray-300 flex justify-center">
    <RouterView name="SideNav" />
    <main class="flex flex-1 max-w-[600px]">
      <RouterView />
    </main>
    <RouterView name="SideFeed" />
  </div>
</template>
