<script setup lang="ts">
import type { User } from '@/types/queries'
import { useQueryClient } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ref } from 'vue'
import { defaultAvatar } from '@/utils/defaultAvatar'
import { Camera } from 'lucide-vue-next'
import { uploadImage } from '@/utils/actions'
import { updateUserMetaByTag } from '@/utils/actions'
import Loading from '@/components/Loading.vue'
const queryClient = useQueryClient()
const userData = defineProps<{ user: User }>()
const username = ref(userData.user.name)
const bio = ref(userData.user.bio!)
const avatar = ref(userData.user.avatar || defaultAvatar)
const uploadInput = ref()
const isUploading = ref(false)

async function updateUserMeta() {
  await updateUserMetaByTag(userData.user.tag, { name: username.value, bio: bio.value })
  queryClient.invalidateQueries({ queryKey: ['userMeta'] })
}

async function uploadAvatar(event: Event) {
  if (isUploading.value) return

  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  isUploading.value = true
  try {
    const file = files[0]
    const url = await uploadImage(file, 'avatar')
    await updateUserMetaByTag(userData.user.tag, { avatar: url })
    avatar.value = url
    isUploading.value = false
  } catch (error) {
    isUploading.value = false
    console.log(error)
  }
}
</script>

<template>
  <DialogHeader>
    <DialogTitle>編輯個人資料</DialogTitle>
  </DialogHeader>
  <div class="flex justify-center relative">
    <div
      @click="uploadInput?.click()"
      class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
    >
      <Loading v-if="isUploading" />
      <div
        v-else-if="!isUploading"
        class="text-primary duration-300 cursor-pointer z-10 border-2 border-primary p-4 rounded-full opacity-0 hover:opacity-100"
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
    </div>
    <img
      :src="avatar"
      class="rounded-full object-cover h-48 w-48 border-border border-2 aspect-square"
    />
  </div>
  <Label for="username">名稱</Label>
  <Input id="username" v-model="username" type="text" />
  <Label for="bio">自我介紹</Label>
  <Textarea id="bio" v-model="bio" type="text" rows="5" maxlength="160"></Textarea>
  <DialogFooter>
    <DialogClose as-child>
      <Button @click="updateUserMeta">儲存</Button>
    </DialogClose>
  </DialogFooter>
</template>
