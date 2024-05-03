<script setup lang="ts">
import SubmitButton from '@/components/PostSubmission/SubmitButton.vue'
import UploadButton from '@/components/PostSubmission/UploadButton.vue'
import PostTextArea from '@/components/PostSubmission/PostTextArea.vue'
import PostImages from '@/components/PostSubmission/PostImages.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import PostAvatar from '@/components/UserAvatar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
const userStore = useUserStore()
// For SideNav & Mobile Floating
const showModal = defineModel<boolean>()
const postContent = ref<string>('')
const imagesBuffer = ref<File[]>([])
const isUploading = ref(false)
</script>

<template>
  <div class="relative w-full border-b-[1px]">
    <LoadingSpinner v-if="isUploading" @click.stop class="absolute top-0 bg-background/80 z-20" />

    <div class="flex relative px-4 pt-4">
      <PostAvatar :avatar="userStore.user.avatar" :tag="userStore.user.tag" />
      <div class="flex-1 p-2">
        <PostTextArea v-model:postContent="postContent" v-model:imagesBuffer="imagesBuffer" />
        <PostImages v-model="imagesBuffer" />
        <div class="flex pt-2">
          <UploadButton v-model="imagesBuffer" />
          <div class="flex-1 flex justify-end items-center">
            <SubmitButton
              v-model:postContent="postContent"
              v-model:imagesBuffer="imagesBuffer"
              v-model:isUploading="isUploading"
              v-model:showModal="showModal"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
