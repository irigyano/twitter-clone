<script setup lang="ts">
import { readFileToBlob } from '@/utils/helper'
const imagesBuffer = defineModel<File[]>()

function removeImageFile(index: number) {
  imagesBuffer.value?.splice(index, 1)
}
</script>

<template>
  <div class="flex gap-1">
    <div class="flex flex-1" v-for="(image, index) in imagesBuffer" :key="index">
      <img
        :src="readFileToBlob(image)"
        class="object-cover w-full rounded-2xl border-[1px]"
        @click="removeImageFile(index)"
      />
    </div>
  </div>
</template>
