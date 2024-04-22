<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { ref, watch } from 'vue'
import Loading from '@/components/Loading.vue'
const isDragOver = ref(false)
const postContent = defineModel<string>('postContent')
const postImageLink = defineModel<string>('postImageLink')
const isUploading = defineModel<boolean>('isUploading')
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
  if (!e.dataTransfer || isUploading.value) return
  isUploading.value = true
  postImageLink.value = undefined
  const file = e.dataTransfer.files[0]
  if (file) {
    // if file is upload from user pc or dropped base64 format
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`

    const { data, error } = await supabase.storage.from('post').upload(filePath, file)
    if (error) throw new Error(error.message)

    postImageLink.value = `${import.meta.env.VITE_SUPABASE_BUCKETS}/${(data as any).fullPath}`
  } else {
    // is file is dropped as url from other website
    const imgUrl = e.dataTransfer.getData('url')
    if (imgUrl) postImageLink.value = imgUrl
  }
  return (isUploading.value = false)
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
  <img
    class="rounded-3xl w-full border-[1px] border-border"
    v-if="postImageLink"
    :src="postImageLink"
    @click="postImageLink = undefined"
  />
  <div class="flex justify-center" v-if="isUploading">
    <Loading />
  </div>
</template>
