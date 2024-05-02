<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post/Post.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useUserStore } from '@/stores/user'
import { getFollowTweetsByUserId } from '@/utils/services'
import wideTime from '@/assets/images/widetime.gif'
const userStore = useUserStore()

const { isLoading, data: tweets } = useQuery({
  queryKey: ['FollowTweets'],
  queryFn: () => getFollowTweetsByUserId(userStore.user.id)
})
</script>

<template>
  <LoadingSpinner v-if="isLoading" class="h-0 flex-1" />
  <div v-else-if="tweets?.length" class="w-full flex flex-col">
    <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
  </div>
  <div v-else class="flex flex-col justify-center flex-1 w-full items-center gap-2">
    <img :src="wideTime" width="380" height="128" alt="widetime" class="w-full" />
    <div class="font-bold text-2xl">還沒有可查看的資訊</div>
    <span class="text-sm text-muted-foreground">追隨更多內容，你就會在這裡看到。</span>
  </div>
</template>
