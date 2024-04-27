<script setup lang="ts">
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
const queryClient = useQueryClient()
const postContent = defineModel<string>('postContent')
const postImageLink = defineModel<string>('postImageLink')
const emit = defineEmits(['submit'])
const userStore = useUserStore()

// TODO: refactor to service
async function sumbitPost({ content, imageSrc }: { content?: string; imageSrc?: string }) {
  const { error } = await supabase
    .from('posts')
    .insert({ content, imageSrc, userId: userStore.user.id })
  if (error) return Promise.reject()
}

const { mutate } = useMutation({
  mutationFn: sumbitPost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tweets'] })
    postContent.value = ''
    postImageLink.value = ''
  }
})
</script>

<template>
  <Button
    :disabled="!postContent?.trim().length && !postImageLink"
    class="hover:bg-primary/80 font-extrabold rounded-full h-9 px-4 disabled:pointer-events-none"
    @click="
      mutate({
        content: postContent?.trim(),
        imageSrc: postImageLink
      })
    "
  >
    發佈
  </Button>
</template>
