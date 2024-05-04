<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import TrendFeed from '@/components/TrendFeed.vue'
import { ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'

const $trend = ref<HTMLDivElement>()
const { height } = useElementSize($trend)

watch(height, (height) => {
  if ($trend.value) $trend.value.style.top = `calc(min(100dvh - ${height}px, 58px))`
})
</script>

<template>
  <footer class="hidden lg:flex flex-[0.25] px-10 flex-col max-w-[350px]">
    <div class="sticky top-0 bg-background py-2 z-10">
      <SearchBar />
    </div>
    <div ref="$trend" class="sticky">
      <TrendFeed />
    </div>
  </footer>
</template>
