<script setup lang="ts">
import { ref } from 'vue'
import SubmitButton from './SubmitButton.vue'
import UploadButton from './UploadButton.vue'
import PostTextArea from './PostTextArea.vue'
const postContent = defineModel<string>()
const imageBase64 = ref('')
// const postContent = ref('')

function resetInput() {
  postContent.value = ''
  imageBase64.value = ''
}
</script>

<template>
  <div class="w-full px-4 pt-4 border-b-[1px] border-gray-700">
    <div class="flex relative">
      <!-- TBA src based on Cookie -->
      <img
        class="h-10 w-10 rounded-full"
        src="https://pbs.twimg.com/profile_images/1757698978060374016/arhSr8o2_400x400.jpg"
        alt="avatar"
      />
      <div class="flex-1 p-2">
        <PostTextArea
          v-model="postContent"
          :imageBase64="imageBase64"
          @post-text="(e) => (postContent = e)"
          @postImage="(e) => (imageBase64 = e)"
          @remove-image="imageBase64 = ''"
        />
        <div class="flex pt-2">
          <UploadButton :onImageBase64Loaded="(image) => (imageBase64 = image)" />
          <div class="flex-1 flex justify-end items-center">
            <SubmitButton
              @submit="resetInput"
              :postContent="postContent"
              :imageBase64="imageBase64"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
