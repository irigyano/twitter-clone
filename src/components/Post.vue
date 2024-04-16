<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Post } from '@/components/PostFeed.vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const queryClient = useQueryClient()

defineProps<{ post: Post['post']; author: Post['author'] }>()

async function deletePost({ id }: { id: string }) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return Promise.reject()
}

const { mutate } = useMutation({
  mutationFn: deletePost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
  onError: () => {
    // pop up
    console.log('failed')
  }
})
</script>

<template>
  <div class="flex gap-2 px-4 pt-2 border-b-[1px] border-gray-700">
    <img
      alt="avatar"
      class="min-w-10 h-10 rounded-full object-cover"
      width="40"
      height="40"
      :src="author!.avatar || ''"
    />
    <div class="flex-1">
      <div class="flex justify-between">
        <div>{{ author!.name }} @{{ author!.tag }}</div>
        <!-- TODO: test with other user -->
        <button v-if="author.id === userStore.user?.id" @click="mutate({ id: post.id })">
          刪除
        </button>
      </div>
      <pre class="text-wrap break-all">{{ post.content }}</pre>
      <img class="rounded-3xl w-full pt-2" v-if="post.imageSrc" :src="post.imageSrc" />
      <div class="flex justify-evenly gap-1">
        <div class="flex-1">{{ post.comments.length }}</div>
        <div class="flex-1">{{ post.likes.length }}</div>
      </div>
    </div>
  </div>
</template>
