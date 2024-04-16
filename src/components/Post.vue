<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, toRefs } from 'vue'
import type { Post } from '@/components/PostFeed.vue'

const queryClient = useQueryClient()
const props = defineProps<{ post: Post }>()

const { post } = toRefs(props)
const user = computed(() => post.value.user)
const commnents = computed(() => post.value.comments)
const likes = computed(() => post.value.likes)

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
      :src="user!.avatar || ''"
    />
    <div class="flex-1">
      <div class="flex justify-between">
        <div>{{ user!.name }} @{{ user!.tag }}</div>
        <button @click="mutate({ id: post.id })">刪除</button>
      </div>
      <pre class="text-wrap break-all">{{ post.content }}</pre>
      <img class="rounded-3xl w-full pt-2" v-if="post.imageSrc" :src="post.imageSrc" />
      <div class="flex justify-evenly gap-1">
        <div class="flex-1">{{ commnents.length }}</div>
        <div class="flex-1">{{ likes.length }}</div>
      </div>
    </div>
  </div>
</template>
