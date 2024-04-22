<script setup lang="ts">
import { ref } from 'vue'
import { ImageUp } from 'lucide-vue-next'
import { useUploadImage } from '@/hooks/useUploadImage'

const uploadImageButton = ref<HTMLInputElement | null>(null)
const postImageLink = defineModel<string>('postImageLink')

const isUploading = defineModel<boolean>('isUploading')

async function uploadPostImage(event: Event) {
  if (isUploading.value) return
  isUploading.value = true
  const url = await useUploadImage(event, 'post')
  postImageLink.value = url
  isUploading.value = false
}
</script>

<template>
  <div @click="uploadImageButton?.click()" class="cursor-pointer flex items-center justify-center">
    <div
      class="text-muted-foreground hover:bg-blue-400 hover:bg-opacity-30 hover:text-blue-400 duration-300 rounded-full p-2"
    >
      <ImageUp :size="18" />
    </div>
    <input
      ref="uploadImageButton"
      class="hidden"
      type="file"
      @change="uploadPostImage"
      accept="image/*"
    />
  </div>
</template>
