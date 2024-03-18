<script setup lang="ts">
import { RouterView } from 'vue-router'
import SideNav from '@/components/SideNav.vue'
</script>

<template>
  <div class="min-h-screen bg-zinc-900 text-gray-300 flex justify-center px-[20%] pt-10">
    <SideNav />
    <div class="flex-1">
      <RouterView />
    </div>
    <SideNav />
  </div>
</template>
