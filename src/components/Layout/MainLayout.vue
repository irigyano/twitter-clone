<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import SideNav from '@/components/Layout/SideNav.vue'
import SideFeed from '@/components/Layout/SideFeed/SideFeed.vue'
import Footer from '@/components/Layout/Mobile/Footer.vue'
const route = useRoute()
</script>

<template>
  <SideNav />
  <main class="flex flex-1 max-w-[600px] sm:border-x-[1px] pb-[25dvh]">
    <RouterView :key="route.path + route.query.q" />
  </main>
  <Footer />
  <SideFeed />
</template>
