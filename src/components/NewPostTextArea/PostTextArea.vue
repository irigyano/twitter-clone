<script setup lang="ts">
import { ref } from 'vue'
const numberOfLineBreaks = ref(1)
const isDragOver = ref(false)
const postContent = defineModel<string>('postContent')
const imageBase64 = defineModel<string>('imageBase64')

function shrinkTextareaRows(event: Event) {
  const inputText = (event.target as HTMLInputElement).value
  const lineBreaks = (inputText.match(/\n/g) || []).length
  numberOfLineBreaks.value = lineBreaks + 1
}

function handleImageDrop(e: DragEvent) {
  if (!e.dataTransfer) return
  readInputToBase64(e.dataTransfer.files)
}

function readInputToBase64(imageFileList: FileList | null) {
  if (!imageFileList) return
  const inputImage = imageFileList[0]
  if (typeof inputImage === 'undefined') return

  const fileReader = new FileReader()

  fileReader.onloadend = function () {
    const baseString = fileReader.result as string
    imageBase64.value = baseString
  }

  fileReader.readAsDataURL(inputImage)
}
</script>

<template>
  <textarea
    v-model="postContent"
    placeholder="有什麼新鮮事？！"
    :class="`placeholder-muted-foreground w-full bg-transparent focus:outline-none border-dashed rounded-md px-2 resize-none border-2 ${isDragOver ? 'border-primary' : 'border-transparent'}`"
    :rows="numberOfLineBreaks"
    @drop.prevent="handleImageDrop"
    @dragover="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop="isDragOver = false"
    @input="shrinkTextareaRows"
  ></textarea>
  <img
    class="rounded-xl w-full p-2"
    v-if="imageBase64"
    :src="imageBase64"
    @click="imageBase64 = ''"
  />
</template>
