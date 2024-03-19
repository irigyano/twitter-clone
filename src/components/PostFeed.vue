<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import Post from '@/components/Post.vue'

async function getPosts() {
  const res = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/posts`)
  return res.data
}

const {
  isLoading,
  isError,
  data: posts,
  error
} = useQuery({
  queryKey: ['posts'],
  queryFn: getPosts
})
</script>

<template>
  <div v-if="isLoading">Loading!</div>
  <div v-else-if="isError">{{ error }}</div>
  <div v-else-if="posts" class="w-full flex flex-col gap-2">
    <Post
      v-for="post in posts"
      :content="post.content"
      :imageSrc="post.imageSrc"
      :author="post.author.name"
      :tag="post.author.tag"
      :avatar="post.author.avatar"
    />
  </div>
</template>
