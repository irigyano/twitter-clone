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
import ImageInput from '@/components/User/ImageInput.vue'
import { defaultAvatar } from '@/utils/defaultAvatar'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const queryClient = useQueryClient()
const { user } = defineProps<{ user: User }>()

const avatarUrl = ref(user.avatar)
const avatarBuffer = ref<File>()

const coverUrl = ref(user.background_cover)
const coverBuffer = ref<File>()

const name = ref(user.name)
const bio = ref(user.bio)

async function updateUserMeta() {
  const userMeta = {
    background_cover: coverUrl.value,
    avatar: avatarUrl.value,
    name: name.value,
    bio: bio.value
  }

  const imagesPromises = []
  if (coverBuffer.value) imagesPromises.push(uploadImage(coverBuffer.value, 'background-cover'))
  if (avatarBuffer.value) imagesPromises.push(uploadImage(avatarBuffer.value, 'avatar'))
  const [cover, avatar] = await Promise.all(imagesPromises)
  // NOTE: If we do coverUrl.value = cover, coverUrl.value would be undefined even tho `cover` is a string, why?
  userMeta.background_cover = cover
  userMeta.avatar = avatar

  await updateUserMetaByTag(user.tag, userMeta)
  // Clean up and revalidate after succeed
  coverBuffer.value = undefined
  avatarBuffer.value = undefined

  // Update UserPage by invalidate, and update Pinia store manually here.
  queryClient.invalidateQueries({ queryKey: [user.tag + 'UserMeta'] })
  if (avatar) userStore.user.avatar = avatar
  userStore.user.name = name.value
}
</script>

<template>
  <DialogContent class="p-0">
    <DialogTitle class="p-4 pb-0">編輯個人資料</DialogTitle>

    <!-- Cover -->
    <div>
      <div class="flex h-40 relative">
        <!-- TODO: actually figure out how img works vs flex item -->
        <img class="w-full object-cover" v-if="coverUrl" :src="coverUrl" />
        <ImageInput v-model:imageUrl="coverUrl" v-model:imageBuffer="coverBuffer" />
      </div>

      <!-- Avatar -->
      <div class="flex relative h-16 px-4">
        <div class="absolute -translate-y-1/3">
          <div class="relative">
            <img
              :src="avatarUrl || defaultAvatar"
              class="rounded-full object-cover h-32 w-32 border-border border-2 aspect-square"
            />
            <ImageInput v-model:imageUrl="avatarUrl" v-model:imageBuffer="avatarBuffer" />
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-4">
      <Label for="name">名稱</Label>
      <Input id="name" v-model="name" type="text" />
      <Label for="bio">自我介紹</Label>
      <Textarea id="bio" v-model="bio!" type="text" rows="5" maxlength="160"></Textarea>
      <DialogFooter>
        <DialogClose as-child>
          <Button @click="updateUserMeta">儲存</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  </DialogContent>
</template>
