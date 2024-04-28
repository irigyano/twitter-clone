<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const isDragOver = ref(false)
const postContent = defineModel<string>('postContent')
const imagesBuffer = defineModel<File[]>('imagesBuffer')
const textarea = ref<HTMLTextAreaElement | null>(null)
const isMaxUpload = computed(() => (imagesBuffer.value?.length || 0) > 3)

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
  if (!fileList || !imagesBuffer.value) return

  if (isMaxUpload.value) {
    return toast({
      title: '請最多選擇 4 個檔案。'
    })
  }

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    imagesBuffer.value.push(file)
  }
}
</script>

<template>
  <textarea
    ref="textarea"
    v-model="postContent"
    placeholder="有什麼新鮮事？！"
    class="placeholder-muted-foreground text-lg font-semibold overflow-y-hidden w-full bg-transparent focus:outline-none border-dashed rounded-md px-2 resize-none border-2"
    :class="`${isDragOver ? (isMaxUpload ? 'border-destructive brightness-200' : 'border-primary') : 'border-transparent'}`"
    @drop.prevent="handleImageDrop"
    @dragover="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop="isDragOver = false"
  ></textarea>
</template>
