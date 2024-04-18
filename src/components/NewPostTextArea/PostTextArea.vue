<script setup lang="ts">
import { ref, watch } from 'vue'
const isDragOver = ref(false)
const postContent = defineModel<string>('postContent')
const imageBase64 = defineModel<string>('imageBase64')

const textarea = ref<HTMLTextAreaElement | null>(null)

function shrinkTextareaRows() {
  if (!textarea.value) return
  textarea.value.style.height = '52px'
  if (textarea.value.scrollHeight > 52)
    textarea.value.style.height = `${textarea.value.scrollHeight + 4}px` // 4px offset for the border
}

watch(postContent, (value) => {
  if (!value) return (textarea.value!.style.height = '52px') // reset after sumbit
  shrinkTextareaRows()
})

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
    ref="textarea"
    v-model="postContent"
    placeholder="有什麼新鮮事？！"
    :class="`placeholder-muted-foreground overflow-y-hidden w-full bg-transparent focus:outline-none border-dashed rounded-md px-2 resize-none border-2 ${isDragOver ? 'border-primary' : 'border-transparent'}`"
    @drop.prevent="handleImageDrop"
    @dragover="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop="isDragOver = false"
  ></textarea>
  <img
    class="rounded-xl w-full p-2"
    v-if="imageBase64"
    :src="imageBase64"
    @click="imageBase64 = ''"
  />
</template>
