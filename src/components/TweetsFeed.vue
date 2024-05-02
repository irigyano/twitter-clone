<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post/Post.vue'
import { getTweets } from '@/utils/services'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import alienGathering from '@/assets/images/AlienGathering.webp'

const { isLoading, data: tweets } = useQuery({
  queryKey: ['tweets'],
  queryFn: getTweets
})
</script>
<template>
  <LoadingSpinner v-if="isLoading" class="h-0 flex-1" />
  <div v-else-if="tweets?.length" class="w-full flex flex-col">
    <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
  </div>
  <div v-else class="flex flex-col justify-center flex-1 w-full items-center gap-2">
    <img :src="alienGathering" width="384" height="80" alt="widetime" class="w-full" />
    <div class="font-bold text-2xl">還沒有可查看的資訊</div>
    <span class="text-sm text-muted-foreground"
      >喜歡、提及、轉貼及更多內容，你就會在這裡看到。</span
    >
  </div>
</template>
