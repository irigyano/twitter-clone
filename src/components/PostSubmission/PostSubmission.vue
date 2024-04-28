<script setup lang="ts">
import SubmitButton from '@/components/PostSubmission/SubmitButton.vue'
import UploadButton from '@/components/PostSubmission/UploadButton.vue'
import PostTextArea from '@/components/PostSubmission/PostTextArea.vue'
import PostImages from '@/components/PostSubmission/PostImages.vue'
import Loading from '@/components/Loading.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
const postContent = ref()
const imagesBuffer = ref<File[]>([])
const isUploading = ref(false)
const userStore = useUserStore()
</script>

<template>
  <div class="relative w-full border-b-[1px]">
    <!-- Cover if its uploading -->
    <div
      v-if="isUploading"
      @click.stop
      class="absolute h-full w-full top-0 bg-background/80 z-20 flex items-center justify-center"
    >
      <Loading />
    </div>

    <div class="flex relative px-4 pt-4">
      <img class="h-10 w-10 rounded-full object-cover" :src="userStore.user.avatar" alt="avatar" />
      <div class="flex-1 p-2">
        <PostTextArea v-model:postContent="postContent" v-model:imagesBuffer="imagesBuffer" />
        <PostImages v-model="imagesBuffer" />
        <div class="flex pt-2">
          <UploadButton v-model:imagesBuffer="imagesBuffer" />
          <div class="flex-1 flex justify-end items-center">
            <SubmitButton
              v-model:postContent="postContent"
              v-model:imagesBuffer="imagesBuffer"
              v-model:isUploading="isUploading"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
