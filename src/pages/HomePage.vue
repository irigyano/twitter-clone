<script setup lang="ts">
import NewPostTextArea from '@/components/NewPostTextArea/NewPostTextArea.vue'
import Category from '@/components/Layout/Category.vue'
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post/Post.vue'
import Loading from '@/components/Loading.vue'
import { getTweets } from '@/utils/services'

const {
  isLoading,
  isError,
  data: tweets,
  error
} = useQuery({
  queryKey: ['posts'],
  queryFn: getTweets,
  gcTime: 0
})
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <Category />
    <NewPostTextArea />
    <div v-if="isLoading" class="fixed top-[50%]">
      <Loading />
    </div>
    <div v-else-if="tweets?.length" class="w-full flex flex-col">
      <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
    </div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <div v-else>Add a new post!</div>
  </div>
</template>
