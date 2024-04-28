<script setup lang="ts">
import { ref } from 'vue'
import { ImageUp } from 'lucide-vue-next'
import { uploadImage } from '@/utils/actions'

const uploadImageButton = ref<HTMLInputElement | null>(null)
const postImageLink = defineModel<string>('postImageLink')

const isUploading = defineModel<boolean>('isUploading')

async function uploadPostImage(event: Event) {
  if (isUploading.value) return

  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  isUploading.value = true
  try {
    const file = files[0]
    const url = await uploadImage(file, 'post')
    postImageLink.value = url
    isUploading.value = false
  } catch (error) {
    isUploading.value = false
    console.log(error)
  }
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
