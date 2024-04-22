<script setup lang="ts">
import { ref } from 'vue'
import { ImageUp } from 'lucide-vue-next'
import { useUploadImage } from '@/hooks/useUploadImage'

const uploadImageButton = ref<HTMLInputElement | null>(null)
const imageBase64 = defineModel<string>('imageBase64')

const isUploading = ref(false)

async function uploadPostImage(event: Event) {
  if (isUploading.value) return
  isUploading.value = true

  try {
    const url = await useUploadImage(event, 'post')
    imageBase64.value = url
  } catch (e) {}
  setTimeout(() => {
    isUploading.value = false
  }, 2000)
}
</script>

<template>
  <div @click="uploadImageButton?.click()" class="cursor-pointer flex items-center justify-center">
    <div class="hover:bg-blue-500 bg-opacity-20 duration-200 rounded-full p-2">
      <ImageUp :size="20" />
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
