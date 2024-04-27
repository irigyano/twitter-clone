<script setup lang="ts">
import { getTweetsByTag } from '@/utils/services'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import Loading from '@/components/Loading.vue'
import Post from '@/components/Post/Post.vue'

const route = useRoute()

const {
  isLoading,
  isError,
  data: tweets
} = useQuery({
  // REVISIT
  queryKey: ['userTweets'],
  queryFn: async () => {
    const data = await getTweetsByTag(route.params.user as string)
    return data
  },
  gcTime: 0,
  retry: false
})
</script>

<template>
  <div v-if="isLoading" class="w-full flex items-center justify-center p-10">
    <Loading />
  </div>

  <div v-else-if="tweets" class="flex flex-col">
    <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
  </div>
</template>
