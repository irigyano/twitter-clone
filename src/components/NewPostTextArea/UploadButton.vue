<script setup lang="ts">
import { ref } from 'vue'
import { ImageUp } from 'lucide-vue-next'
const uploadImageButton = ref<HTMLInputElement | null>(null)
const emit = defineEmits(['imageBase64Loaded'])

function sumbitPost(e: Event) {
  if (!e.target) return

  const imageFileList = (e.target as HTMLInputElement).files

  if (!imageFileList) return
  const inputImage = imageFileList[0]
  if (typeof inputImage === 'undefined') return

  const fileReader = new FileReader()

  fileReader.onloadend = function () {
    const baseString = fileReader.result as string
    emit('imageBase64Loaded', baseString)
  }

  fileReader.readAsDataURL(inputImage)
}
</script>

<template>
  <div @click="uploadImageButton?.click()" class="cursor-pointer flex items-center justify-center">
    <div class="hover:bg-blue-500 bg-opacity-20 duration-200 rounded-full p-2">
      <ImageUp :size="20" />
    </div>
    <input ref="uploadImageButton" class="w-0 h-0" type="file" @change="sumbitPost" />
  </div>
</template>
