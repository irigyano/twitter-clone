<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
const queryClient = useQueryClient()
// https://github.com/supabase/supabase-js/issues/244
defineProps<{
  id: number
  content: string | null
  imageSrc: string | null
  author: string
  tag: string
  avatar: string | null
}>()

async function deletePost({ id }: { id: number }) {
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
      :src="avatar || ''"
    />
    <div class="flex-1">
      <div class="flex justify-between">
        <div>{{ author }} @{{ tag }}</div>
        <button @click="mutate({ id })">刪除</button>
      </div>
      <pre class="text-wrap break-all">{{ content }}</pre>
      <img class="rounded-3xl w-full pt-2" v-if="imageSrc" :src="imageSrc" />
      <div class="flex justify-evenly gap-1">
        <div class="bg-blue-500 flex-1">Comments</div>
        <div class="bg-blue-500 flex-1">Likes</div>
      </div>
    </div>
  </div>
</template>
