<script setup lang="ts">
import SubmitButton from './SubmitButton.vue'
import UploadButton from './UploadButton.vue'
import PostTextArea from './PostTextArea.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
const postContent = ref()
const postImageLink = ref()
const isUploading = ref(false)
const userStore = useUserStore()
</script>

<template>
  <div class="w-full px-4 pt-4 border-b-[1px] border-border">
    <div class="flex relative">
      <img class="h-10 w-10 rounded-full" :src="userStore.user.avatar" alt="avatar" />
      <div class="flex-1 p-2">
        <PostTextArea
          v-model:postContent="postContent"
          v-model:imageBase64="postImageLink"
          v-model:isUploading="isUploading"
        />
        <div class="flex pt-2">
          <UploadButton v-model:imageBase64="postImageLink" v-model:isUploading="isUploading" />
          <div class="flex-1 flex justify-end items-center">
            <SubmitButton v-model:postContent="postContent" v-model:imageBase64="postImageLink" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
