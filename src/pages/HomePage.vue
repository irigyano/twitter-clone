<script setup lang="ts">
import PostSubmission from '@/components/PostSubmission/PostSubmission.vue'
import Category from '@/components/Layout/Category.vue'
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post/Post.vue'
import { getTweets } from '@/utils/services'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const {
  isLoading,
  isError,
  data: tweets,
  error
} = useQuery({
  queryKey: ['tweets'],
  queryFn: getTweets,
  gcTime: 0
})
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <Category />
    <PostSubmission />
    <LoadingSpinner v-if="isLoading" class="h-0 flex-1" />
    <div v-else-if="tweets?.length" class="w-full flex flex-col">
      <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
    </div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <div v-else>Add a new post!</div>
  </div>
</template>
