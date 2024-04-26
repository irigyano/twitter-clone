<script setup lang="ts">
import { ref } from 'vue'
import { Camera } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useQueryClient } from '@tanstack/vue-query'
import { useUploadImage } from '@/hooks/useUploadImage'
import { updateUserMetaByTag } from '@/utils/query'
const queryClient = useQueryClient()
const uploadInput = ref()
const userStore = useUserStore()
const isUploading = ref(false)

async function uploadCover(event: Event) {
  if (isUploading.value) return
  isUploading.value = true
  try {
    const url = await useUploadImage(event, 'background-cover')
    await updateUserMetaByTag(userStore.user.tag, { background_cover: url })
  } catch (error) {}
  queryClient.invalidateQueries({ queryKey: ['userPosts'] })
  setTimeout(() => {
    isUploading.value = false
  }, 2000)
}
</script>

<template>
  <div
    v-if="!isUploading"
    @click="uploadInput?.click()"
    class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hover:text-primary duration-300 cursor-pointer z-10 opacity-0 hover:opacity-100 border-2 border-primary p-4 rounded-full"
  >
    <Camera :size="30" />
    <input
      ref="uploadInput"
      type="file"
      class="visibility: hidden"
      @change="uploadCover"
      accept="image/*"
    />
  </div>
</template>
