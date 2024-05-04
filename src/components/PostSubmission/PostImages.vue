<script setup lang="ts">
import { readFileToBlob } from '@/utils/helper'
import { X } from 'lucide-vue-next'
const imagesBuffer = defineModel<File[]>()

function removeImageFile(index: number) {
  imagesBuffer.value?.splice(index, 1)
}
</script>

<template>
  <div class="flex gap-1">
    <div class="relative flex-1" v-for="(image, index) in imagesBuffer" :key="index">
      <img
        :src="readFileToBlob(image)"
        class="object-cover rounded-2xl border-[1px] w-full h-full"
      />
      <button
        class="absolute top-2 left-2 text-primary hover:bg-secondary rounded-full duration-300 p-1"
        @click="removeImageFile(index)"
      >
        <X />
      </button>
    </div>
  </div>
</template>
