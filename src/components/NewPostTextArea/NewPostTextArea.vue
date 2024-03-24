<script setup lang="ts">
import { ref, defineModel } from 'vue'
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import axios from 'axios'
import { ImageUp } from 'lucide-vue-next'
const numberOfLineBreaks = ref(1)
const isDragOver = ref(false)
const postContent = defineModel<string>()
const queryClient = useQueryClient()
const uploadImageButton = ref<HTMLInputElement | null>(null)
const imageBase64 = ref('')

const { mutate } = useMutation({
  mutationFn: (newPost: { content?: string; authorId: number; imageSrc: string }) => {
    const endpoint = `${import.meta.env.VITE_API_ENDPOINT}/posts`
    return axios.post(endpoint, newPost)
  },
  onSuccess: () => {
    // manually reset is bad
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    postContent.value = ''
    imageBase64.value = ''
  }
})

function shrinkTextareaRows(event: Event) {
  const inputText = (event.target as HTMLInputElement).value
  const lineBreaks = (inputText.match(/\n/g) || []).length
  numberOfLineBreaks.value = lineBreaks + 1
}

function handleImageDrop(e: DragEvent) {
  if (!e.dataTransfer) return
  readInputToBase64(e.dataTransfer.files)
}

function sumbitPost(e: Event) {
  if (!e.target) return
  readInputToBase64((e.target as HTMLInputElement).files)
}

function readInputToBase64(imageFileList: FileList | null) {
  if (!imageFileList) return
  const inputImage = imageFileList[0]
  if (typeof inputImage === 'undefined') return

  const fileReader = new FileReader()

  fileReader.onloadend = function () {
    const baseString = fileReader.result as string
    imageBase64.value = baseString
  }

  fileReader.readAsDataURL(inputImage)
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
        <textarea
          placeholder="有什麼新鮮事？！"
          :class="`placeholder-gray-400 w-full bg-transparent focus:outline-none border-dashed rounded-md p-2 resize-none border-2 ${isDragOver ? 'border-blue-500' : 'border-transparent'}`"
          :rows="numberOfLineBreaks"
          v-model="postContent"
          @drop.prevent="handleImageDrop"
          @dragover="isDragOver = true"
          @dragleave="isDragOver = false"
          @drop="isDragOver = false"
          @input="shrinkTextareaRows"
        >
        </textarea>
        <img
          class="rounded-xl w-full p-2"
          v-if="imageBase64"
          :src="imageBase64"
          @click="imageBase64 = ''"
        />
        <div class="flex pt-2">
          <div
            @click="uploadImageButton?.click()"
            class="cursor-pointer flex items-center justify-center"
          >
            <div class="hover:bg-blue-500 bg-opacity-20 duration-200 rounded-full p-2">
              <ImageUp :size="20" />
            </div>
            <input ref="uploadImageButton" class="w-0 h-0" type="file" @change="sumbitPost" />
          </div>
          <div class="flex-1 flex justify-end items-center">
            <button
              :disabled="!postContent && !imageBase64"
              :class="`${!postContent && !imageBase64 ? 'bg-blue-400 opacity-50' : 'bg-blue-500 opacity-100'} hover:bg-blue-600 font-extrabold rounded-full h-9 px-4 disabled:pointer-events-none`"
              @click="
                mutate({
                  content: postContent,
                  imageSrc: imageBase64,
                  authorId: 1
                })
              "
            >
              發佈
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
