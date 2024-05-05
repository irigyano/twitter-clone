<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { wordFrequenciesRpc } from '@/utils/rpc'
import { useQuery } from '@tanstack/vue-query'

const { isLoading, data: trends } = useQuery({
  queryKey: ['Trend'],
  queryFn: wordFrequenciesRpc
})
</script>

<template>
  <div class="border-[1px] py-4 rounded-2xl">
    <div v-if="isLoading" class="h-80">
      <LoadingSpinner />
    </div>

    <div v-else-if="trends?.length" class="flex flex-col">
      <div class="text-xl font-bold p-2 px-4">你的流行趨勢</div>
      <RouterLink
        v-for="trend in trends"
        :key="trend.word"
        :to="`/search?q=${trend.word}`"
        class="hover:bg-secondary duration-300 flex flex-col p-2 px-4"
      >
        <span class="text-primary font-bold truncate">
          {{ trend.word }}
        </span>
        <span class="text-muted-foreground text-sm"> {{ trend.ndoc }} 則貼文 </span>
      </RouterLink>
    </div>
  </div>
</template>
-
