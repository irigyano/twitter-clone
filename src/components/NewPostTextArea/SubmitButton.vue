<script setup lang="ts">
import { useQueryClient, useMutation } from '@tanstack/vue-query'
const queryClient = useQueryClient()
const postContent = defineModel<string>('postContent')
const imageBase64 = defineModel<string>('imageBase64')
const emit = defineEmits(['submit'])
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

async function sumbitPost({ content, imageSrc }: { content?: string; imageSrc?: string }) {
  const { error } = await supabase
    .from('posts')
    .insert({ content, imageSrc, userId: userStore.user.id })
  if (error) return Promise.reject()
}

const { mutate } = useMutation({
  mutationFn: sumbitPost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    postContent.value = ''
    imageBase64.value = ''
  },
  onError: () => {
    // pop up
    console.log('failed')
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
        imageSrc: imageBase64
      })
    "
  >
    發佈
  </button>
</template>
