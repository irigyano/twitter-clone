<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import TrendFeed from '@/components/Layout/SideFeed/TrendFeed.vue'
import WhoToFollowFeed from '@/components/Layout/SideFeed/WhoToFollowFeed.vue'
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
    <div ref="$trend" class="sticky flex flex-col gap-2">
      <TrendFeed />
      <WhoToFollowFeed />
      <span class="pb-20 text-xs text-muted-foreground"
        >© 2024 irigyano
        <a href="https://github.com/irigyano" class="underline hover:text-primary duration-300"
          >GitHub</a
        >
      </span>
    </div>
  </footer>
</template>
