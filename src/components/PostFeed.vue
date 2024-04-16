<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post.vue'
import { supabase } from '@/utils/supabase'
import Loading from '@/components/Loading.vue'

type ExcludeNull<T> = T extends null ? never : T
export type Post = ExcludeNull<Awaited<ReturnType<typeof getPostsFromSupabase>>>[number]

// TODO: fix user type can be null
async function getPostsFromSupabase() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(*), comments(*), likes(*)')
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
  <div v-if="isLoading" class="fixed top-[50%]">
    <Loading />
  </div>
  <div v-else-if="isError">{{ error }}</div>
  <div v-else-if="posts!.length > 0" class="w-full flex flex-col gap-2">
    <Post v-for="post in posts" :post="post" />
  </div>
  <div v-else>Add a new post!</div>
</template>
