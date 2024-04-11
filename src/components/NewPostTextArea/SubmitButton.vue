<script setup lang="ts">
import { useQueryClient, useMutation } from '@tanstack/vue-query'
const queryClient = useQueryClient()
const postContent = defineModel<string>('postContent')
const imageBase64 = defineModel<string>('imageBase64')
const emit = defineEmits(['submit'])

import { supabase } from '@/utils/supabase'

async function sumbitPost(newPost: { content?: string; authorId: number; imageSrc: string }) {
  const { error } = await supabase.from('posts').insert(newPost)
  if (!error) return Promise.resolve()
}

const { mutate } = useMutation({
  mutationFn: sumbitPost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    postContent.value = ''
    imageBase64.value = ''
  }
})
</script>

<template>
  <button
    :disabled="!postContent && !imageBase64"
    :class="`${!postContent && !imageBase64 ? 'bg-blue-400 opacity-50' : 'bg-blue-500 opacity-100'} hover:bg-blue-600 font-extrabold rounded-full h-9 px-4 disabled:pointer-events-none`"
    @click="
      mutate({
        content: postContent,
        imageSrc: imageBase64 || '',
        authorId: 1
      })
    "
  >
    發佈
  </button>
</template>
