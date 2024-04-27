<script setup lang="ts">
import { ref } from 'vue'
import { Camera } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useQueryClient } from '@tanstack/vue-query'
import { useUploadImage } from '@/hooks/useUploadImage'
import { updateUserMetaByTag } from '@/utils/actions'
import Loading from '@/components/Loading.vue'
const queryClient = useQueryClient()
const uploadInput = ref()
const userStore = useUserStore()
const isUploading = ref(false)

async function uploadCover(event: Event) {
  if (isUploading.value) return
  isUploading.value = true

  const url = await useUploadImage(event, 'background-cover')
  await updateUserMetaByTag(userStore.user.tag, { background_cover: url })

  queryClient.invalidateQueries({ queryKey: ['userMeta'] })
  isUploading.value = false
}
</script>

<template>
  <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
    <Loading v-if="isUploading" />
    <div
      v-else-if="!isUploading"
      @click="uploadInput?.click()"
      class="cursor-pointer border-2 border-primary p-4 rounded-full opacity-0 hover:opacity-100 duration-300 text-primary"
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
  </div>
</template>
