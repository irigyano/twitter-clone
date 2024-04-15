<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post.vue'
import { supabase } from '@/utils/supabase'
import Loading from '@/components/Loading.vue'

async function getPostsFromSupabase() {
  // https://www.reddit.com/r/Supabase/comments/12ti2ay/how_do_i_throw_an_error_for_selects/
  // If we want avoid fetching with anon key which returns 200 with empty array
  // we have to 'getUser' here to make sure every request made by query is authorized
  // but seems redundant..?

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
  <div v-if="isLoading" class="fixed top-[50%]">
    <Loading />
  </div>
  <div v-else-if="isError">{{ error }}</div>
  <div v-else-if="posts!.length > 0" class="w-full flex flex-col gap-2">
    <Post
      v-for="post in posts"
      :id="post.id"
      :content="post.content"
      :imageSrc="post.imageSrc"
      :author="post.users!.name"
      :tag="post.users!.tag"
      :avatar="post.users!.avatar"
    />
  </div>
  <div v-else>Add a new post!</div>
</template>
