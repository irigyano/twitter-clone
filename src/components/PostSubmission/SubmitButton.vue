<script setup lang="ts">
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { insertPost } from '@/utils/actions'
import { uploadMultipleImages } from '@/utils/actions'
const userStore = useUserStore()
const queryClient = useQueryClient()
const postContent = defineModel<string>('postContent')
const imagesBuffer = defineModel<File[]>('imagesBuffer')
const isUploading = defineModel<boolean>('isUploading')
const showModal = defineModel<boolean>('showModal')
const { mutate } = useMutation({
  mutationFn: async () => {
    isUploading.value = true
    let imagesUrl = undefined

    if (imagesBuffer.value?.length) {
      imagesUrl = await uploadMultipleImages(imagesBuffer.value)
    }

    return insertPost({
      content: postContent.value?.trim(),
      imageSrc: imagesUrl,
      userId: userStore.user.id
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tweets'] })
    queryClient.invalidateQueries({ queryKey: ['UserTweets'] })
    postContent.value = ''
    imagesBuffer.value = []
    isUploading.value = false
    showModal.value = false
  }
})
</script>

<template>
  <Button
    :disabled="!postContent?.trim().length && !imagesBuffer?.length"
    class="hover:bg-primary/80 font-extrabold rounded-full h-9 px-4 disabled:pointer-events-none"
    @click="mutate()"
  >
    發佈
  </Button>
</template>
