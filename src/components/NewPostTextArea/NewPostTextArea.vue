<script setup lang="ts">
import SubmitButton from './SubmitButton.vue'
import UploadButton from './UploadButton.vue'
import PostTextArea from './PostTextArea.vue'
import { useUserStore } from '@/stores/user'
const postContent = defineModel<string>('postContent')
const imageBase64 = defineModel<string>('imageBase64')
const userStore = useUserStore()
</script>

<template>
  <div class="w-full px-4 pt-4 border-b-[1px] border-gray-700">
    <div class="flex relative">
      <img class="h-10 w-10 rounded-full" :src="userStore.user.avatar || ''" alt="avatar" />
      <div class="flex-1 p-2">
        <PostTextArea v-model:postContent="postContent" v-model:imageBase64="imageBase64" />
        <div class="flex pt-2">
          <UploadButton v-model:imageBase64="imageBase64" />
          <div class="flex-1 flex justify-end items-center">
            <SubmitButton v-model:postContent="postContent" v-model:imageBase64="imageBase64" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
