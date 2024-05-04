<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const isDragOver = ref(false)
const postContent = defineModel<string>('postContent')
const imagesBuffer = defineModel<File[]>('imagesBuffer')
const isMaxUpload = computed(() => (imagesBuffer.value?.length || 0) > 3)
const textareaRef = defineModel<HTMLTextAreaElement>('textareaRef')

function handleImageDrop(e: DragEvent) {
  if (isMaxUpload.value) return toast({ title: '請最多選擇 4 個檔案。' })

  const fileList = e.dataTransfer?.files
  if (!fileList || !imagesBuffer.value) return

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    imagesBuffer.value.push(file)
  }

  const fileUrl = e.dataTransfer?.getData('url')
  if (!fileList.length && fileUrl) {
    // Add a space between content and url
    postContent.value += postContent.value ? '\n' + fileUrl : fileUrl
  }
}

function handlePaste(e: ClipboardEvent) {
  if (isMaxUpload.value) return toast({ title: '請最多選擇 4 個檔案。' })

  const items = e.clipboardData?.items
  if (!items?.length) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.includes('image')) {
      const file = item.getAsFile()
      if (file) imagesBuffer.value?.push(file)
    }
  }
}
</script>

<template>
  <textarea
    ref="textareaRef"
    v-model="postContent"
    placeholder="有什麼新鮮事？！"
    rows="3"
    class="placeholder-muted-foreground text-lg font-semibold overflow-y-hidden w-full bg-transparent focus:outline-none border-dashed rounded-md px-2 resize-none border-2"
    :class="`${isDragOver ? (isMaxUpload ? 'border-destructive brightness-200' : 'border-primary') : 'border-transparent'}`"
    @drop.prevent="handleImageDrop"
    @dragover="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop="isDragOver = false"
    @paste="handlePaste"
  ></textarea>
</template>
