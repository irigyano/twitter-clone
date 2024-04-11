<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post.vue'
import { supabase } from '@/utils/supabase'

async function getPostsFromSupabase() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(*)')
    .order('created_at', { ascending: false })
  return data
}

const {
  isLoading,
  isError,
  data: posts,
  error
} = useQuery({
  queryKey: ['posts'],
  queryFn: getPostsFromSupabase,
  retry: false
})
</script>

<template>
  <!-- TODO: spinner for UX -->
  <div v-if="isLoading">Loading!</div>
  <div v-else-if="isError">{{ error }}</div>
  <div v-else-if="posts!.length > 0" class="w-full flex flex-col gap-2">
    <Post
      v-for="post in posts"
      :content="post.content"
      :imageSrc="post.imageSrc"
      :author="post.users!.name"
      :tag="post.users!.tag"
      :avatar="post.users!.avatar"
    />
  </div>
  <div v-else>Add a new post!</div>
</template>
