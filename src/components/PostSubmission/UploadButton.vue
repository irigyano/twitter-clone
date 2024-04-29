<script setup lang="ts">
import { computed, ref } from 'vue'
import { ImageUp } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const uploadImageButton = ref<HTMLInputElement>()
const imagesBuffer = defineModel<File[]>()
const isMaxUpload = computed(() => (imagesBuffer.value?.length || 0) > 3)

async function uploadPostImage(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0 || !imagesBuffer.value) return

  if (isMaxUpload.value) {
    return toast({
      title: '請最多選擇 4 個檔案。'
    })
  }

  const file = files[0]
  imagesBuffer.value.push(file)
}
</script>

<template>
  <div
    @click="uploadImageButton?.click()"
    class="text-muted-foreground rounded-full p-2 flex items-center justify-center"
    :class="
      !isMaxUpload &&
      'hover:bg-blue-400 hover:bg-opacity-30 hover:text-blue-400 duration-300 cursor-pointer'
    "
  >
    <ImageUp :size="18" />
  </div>
  <input
    ref="uploadImageButton"
    class="hidden"
    type="file"
    @change="uploadPostImage"
    accept="image/*"
    :disabled="isMaxUpload"
  />
</template>
