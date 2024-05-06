<script setup lang="ts">
import { getTweetsByTag } from '@/utils/services'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import Post from '@/components/Post/Post.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()

const { isLoading, data: tweets } = useQuery({
  queryKey: ['UserTweets'],
  queryFn: () => getTweetsByTag(route.params.user as string),
  retry: false
})
</script>

<template>
  <LoadingSpinner v-if="isLoading" />

  <div v-else-if="tweets?.length" class="flex flex-col">
    <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
  </div>

  <div v-else class="flex items-center justify-center text-3xl flex-1">
    <div>@{{ route.params.user }} 尚未新增貼文</div>
  </div>
</template>
