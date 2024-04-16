<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post.vue'
import { supabase } from '@/utils/supabase'
import Loading from '@/components/Loading.vue'
export type Post = Awaited<ReturnType<typeof getPostsFromSupabase>>[number]

async function getPostsFromSupabase() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(*), comments(*), likes(*)')
    .order('created_at', { ascending: false })

  const trimmed = data?.map((post) => {
    const { user, ...rest } = post
    return {
      author: user!,
      post: rest
    }
  })

  return trimmed || []
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
  <div v-if="isLoading" class="fixed top-[50%]">
    <Loading />
  </div>
  <div v-else-if="posts?.length" class="w-full flex flex-col gap-2">
    <Post v-for="post in posts" :author="post.author" :post="post.post" />
  </div>
  <div v-else-if="isError">Error: {{ error }}</div>
  <div v-else>Add a new post!</div>
</template>
