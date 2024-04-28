<script setup lang="ts">
import { ref, watch } from 'vue'
const isDragOver = ref(false)
const postContent = defineModel<string>('postContent')
const imagesBuffer = defineModel<File[]>('imagesBuffer')
const textarea = ref<HTMLTextAreaElement | null>(null)

// responsive textarea rows
function shrinkTextareaRows() {
  if (!textarea.value) return
  textarea.value.style.height = '60px'
  if (textarea.value.scrollHeight > 60)
    textarea.value.style.height = `${textarea.value.scrollHeight + 4}px` // 4px offset for the border
}
watch(postContent, (value) => {
  if (!value) return (textarea.value!.style.height = '60px') // reset after sumbit
  shrinkTextareaRows()
})

async function handleImageDrop(e: DragEvent) {
  const fileList = e.dataTransfer?.files
  if (!fileList) return

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    imagesBuffer.value?.push(file)
  }
}
</script>

<template>
  <textarea
    ref="textarea"
    v-model="postContent"
    placeholder="有什麼新鮮事？！"
    :class="`placeholder-muted-foreground text-lg font-semibold overflow-y-hidden w-full bg-transparent focus:outline-none border-dashed rounded-md px-2 resize-none border-2 ${isDragOver ? 'border-primary' : 'border-transparent'}`"
    @drop.prevent="handleImageDrop"
    @dragover="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop="isDragOver = false"
  ></textarea>
</template>
