<script setup lang="ts">
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { insertPost } from '@/utils/actions'
const queryClient = useQueryClient()
const postContent = defineModel<string>('postContent')
const postImageLink = defineModel<string>('postImageLink')
const emit = defineEmits(['submit'])
const userStore = useUserStore()

const { mutate } = useMutation({
  mutationFn: () =>
    insertPost({
      content: postContent.value?.trim(),
      imageSrc: postImageLink.value,
      userId: userStore.user.id
    }),
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
    @click="mutate()"
  >
    發佈
  </Button>
</template>
