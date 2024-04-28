<script setup lang="ts">
import { ref } from 'vue'
import { ImageUp } from 'lucide-vue-next'
const uploadImageButton = ref<HTMLInputElement | null>(null)
const imagesBuffer = defineModel<File[]>('imagesBuffer')

async function uploadPostImage(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const file = files[0]
  imagesBuffer.value?.push(file)
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
