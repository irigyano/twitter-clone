<script setup lang="ts">
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import axios from 'axios'
const queryClient = useQueryClient()
defineProps<{ postContent?: string; imageBase64: string }>()

const emit = defineEmits(['submit'])

const { mutate } = useMutation({
  mutationFn: (newPost: { content?: string; authorId: number; imageSrc: string }) => {
    const endpoint = `${import.meta.env.VITE_API_ENDPOINT}/posts`
    return axios.post(endpoint, newPost)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    emit('submit')
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
        imageSrc: imageBase64,
        authorId: 1
      })
    "
  >
    發佈
  </button>
</template>
