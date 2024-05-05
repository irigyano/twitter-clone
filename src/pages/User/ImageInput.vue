<script setup lang="ts">
import { readFileToBlob } from '@/utils/helper'
import { ref } from 'vue'
import { Camera } from 'lucide-vue-next'
const imageUrl = defineModel<string | null>('imageUrl')
const imageBuffer = defineModel<File>('imageBuffer')
const $Input = ref<HTMLInputElement>()

function loadImageIntoBuffer(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const file = files[0]

  imageBuffer.value = file

  // !! QUESTION:
  // If we use imageBuffer.value instead of file here,
  // It appears that file is undefined thus parsing to blob would fail,
  // So: assign value to v-model is asynchronous?
  imageUrl.value = readFileToBlob(file)
}
</script>

<template>
  <div
    @click="$Input?.click()"
    class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer z-10 hover:bg-secondary/70 p-2 rounded-full duration-300"
  >
    <Camera :size="24" class="text-primary" />
    <input ref="$Input" type="file" class="hidden" @change="loadImageIntoBuffer" accept="image/*" />
  </div>
</template>
