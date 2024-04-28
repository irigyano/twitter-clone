<script setup lang="ts">
const imagesBuffer = defineModel<File[]>()

function removeImageFile(index: number) {
  imagesBuffer.value?.splice(index, 1)
}

function fileToBlob(f: File) {
  const blob = URL.createObjectURL(f)
  return blob
}
</script>

<template>
  <div class="flex">
    <div class="flex-1 flex" v-for="(image, index) in imagesBuffer" :key="index">
      <img
        :src="fileToBlob(image)"
        class="object-cover w-full rounded-2xl border-[1px]"
        @click="removeImageFile(index)"
      />
    </div>
  </div>
</template>
