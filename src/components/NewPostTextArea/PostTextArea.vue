<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ imageBase64?: string }>()
const numberOfLineBreaks = ref(1)
const isDragOver = ref(false)
const postContent = defineModel<string>()
const emit = defineEmits(['postText', 'postImage', 'removeImage'])

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
    emit('postImage', baseString)
  }

  fileReader.readAsDataURL(inputImage)
}
</script>

<template>
  <textarea
    v-model="postContent"
    placeholder="有什麼新鮮事？！"
    :class="`placeholder-gray-400 w-full bg-transparent focus:outline-none border-dashed rounded-md p-2 resize-none border-2 ${isDragOver ? 'border-blue-500' : 'border-transparent'}`"
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
    @click="emit('removeImage')"
  />
</template>
