<script setup lang="ts">
import type { User } from '@/types/queries'
import { useQueryClient } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter, DialogTitle, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ref } from 'vue'
import { uploadImage } from '@/utils/actions'
import { updateUserMetaByTag } from '@/utils/actions'
import ImageInput from '@/pages/User/ImageInput.vue'
import { useUserStore } from '@/stores/user'
import PostAvatar from '@/components/UserAvatar.vue'
const userStore = useUserStore()
const queryClient = useQueryClient()
const { user } = defineProps<{ user: User }>()

const userMeta = ref({
  background_cover: user.background_cover,
  avatar: user.avatar,
  name: user.name,
  bio: user.bio
})

const coverBuffer = ref<File>()
const avatarBuffer = ref<File>()

function uploadImagesFromBuffer() {
  const uploadPromises = []
  if (coverBuffer.value) {
    const uploadCover = uploadImage(coverBuffer.value, 'background-cover').then(
      (url) => (userMeta.value.background_cover = url)
    )
    uploadPromises.push(uploadCover)
  }

  if (avatarBuffer.value) {
    const uploadAvatar = uploadImage(avatarBuffer.value, 'avatar').then(
      (url) => (userMeta.value.avatar = url)
    )
    uploadPromises.push(uploadAvatar)
  }
  // Wait for uploaded urls
  return Promise.all(uploadPromises)
}

async function updateUserMeta() {
  await uploadImagesFromBuffer()

  await updateUserMetaByTag(user.tag, userMeta.value)
  // Clean up and revalidate after succeed
  coverBuffer.value = undefined
  avatarBuffer.value = undefined

  // Update UserPage by invalidate, and update Pinia store manually here.
  queryClient.invalidateQueries({ queryKey: [user.tag + 'UserMeta'] })
  if (userMeta.value.avatar) userStore.user.avatar = userMeta.value.avatar
  userStore.user.name = userMeta.value.name
}
</script>

<template>
  <DialogContent class="p-0">
    <DialogTitle class="p-4 pb-0">編輯個人資料</DialogTitle>

    <!-- Cover -->
    <div>
      <div class="flex h-40 relative">
        <img
          class="w-full object-cover"
          v-if="userMeta.background_cover"
          :src="userMeta.background_cover"
        />
        <ImageInput
          v-model:imageUrl="userMeta.background_cover"
          v-model:imageBuffer="coverBuffer"
        />
      </div>

      <!-- Avatar -->
      <div class="flex relative h-16 px-4">
        <div class="absolute -translate-y-1/3">
          <div class="relative">
            <PostAvatar
              :avatar="userMeta.avatar"
              :tag="userStore.user.tag"
              class="h-32 w-32 border-2"
            />
            <ImageInput v-model:imageUrl="userMeta.avatar" v-model:imageBuffer="avatarBuffer" />
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-4">
      <Label for="name">名稱</Label>
      <Input id="name" v-model="userMeta.name" type="text" />
      <Label for="bio">自我介紹</Label>
      <Textarea id="bio" v-model="userMeta.bio!" type="text" rows="5" maxlength="160"></Textarea>
      <DialogFooter>
        <DialogClose as-child>
          <Button @click="updateUserMeta">儲存</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  </DialogContent>
</template>
