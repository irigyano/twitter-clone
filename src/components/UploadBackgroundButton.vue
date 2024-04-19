<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { Camera } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useQueryClient } from '@tanstack/vue-query'
const queryClient = useQueryClient()
const uploadInput = ref()
const userStore = useUserStore()
const isUploading = ref(false)
const files = ref()

const uploadAvatar = async (event: Event) => {
  if (isUploading.value) return
  isUploading.value = true

  files.value = (event.target as HTMLInputElement).files
  if (!files.value || files.value.length === 0) return

  const file = files.value[0]
  const fileExt = file.name.split('.').pop()
  const filePath = `${Math.random()}.${fileExt}`

  const { data } = await supabase.storage.from('background-cover').upload(filePath, file)
  if (!data) return
  files.value = null

  await supabase
    .from('users')
    .update({
      background_cover: `${import.meta.env.VITE_SUPABASE_BUCKETS}/${(data as any).fullPath}`
    })
    .eq('tag', userStore.user.tag)
    .single()
  // UX: let user see the new background cover
  queryClient.invalidateQueries({ queryKey: ['userPosts'] })
  isUploading.value = false
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
      @change="uploadAvatar"
      accept="image/*"
    />
  </div>
</template>
