<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post.vue'
import Loading from '@/components/Loading.vue'
import { getPosts } from '@/utils/query'

const {
  isLoading,
  isError,
  data: posts,
  error
} = useQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
  gcTime: 0
})
</script>

<template>
  <div v-if="isLoading" class="fixed top-[50%]">
    <Loading />
  </div>
  <div v-else-if="posts?.length" class="w-full flex flex-col gap-2">
    <Post v-for="post in posts" :author="post.author" :post="post.post" :key="post.post.id" />
  </div>
  <div v-else-if="isError">Error: {{ error }}</div>
  <div v-else>Add a new post!</div>
</template>
