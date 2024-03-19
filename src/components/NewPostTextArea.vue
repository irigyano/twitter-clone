<script setup lang="ts">
// TODO:
// 1. How to split the compoent?(its too complicated atm)
// 2. Typing all the refs correctly

import { ref } from 'vue'
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import axios from 'axios'

const queryClient = useQueryClient()

const postContent = defineModel<string>('')
const imageInput = ref<HTMLInputElement | null>(null)

const numberOfLineBreaks = ref(1)
const imgSrc = ref('')
const isDragOver = ref(false)

const { mutate } = useMutation({
  mutationFn: (newPost: { content?: string; authorId: number; imageSrc: string }) => {
    const endpoint = `${import.meta.env.VITE_API_ENDPOINT}/posts`
    return axios.post(endpoint, newPost)
  },
  onSuccess: () => {
    // manually reset is bad
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    postContent.value = ''
    imgSrc.value = ''
    numberOfLineBreaks.value = 1
  }
})

function shrinkTextareaRows(event: Event) {
  const inputText = (event.target as HTMLInputElement).value
  const lineBreaks = (inputText.match(/\n/g) || []).length
  numberOfLineBreaks.value = lineBreaks + 1
}

function readFile(imageFileList: FileList | null) {
  if (!imageFileList) return
  const inputImage = imageFileList[0]
  if (typeof inputImage === 'undefined') return

  const fileReader = new FileReader()

  fileReader.onloadend = function () {
    const baseString = fileReader.result as string
    // manually reset is bad
    imgSrc.value = baseString
    isDragOver.value = false
  }

  fileReader.readAsDataURL(inputImage)
}
</script>

<template>
  <div class="hidden sm:block w-full">
    <div class="flex relative">
      <!-- TBA src based on Cookie -->
      <img
        class="h-10 w-10 rounded-full"
        src="https://pbs.twimg.com/profile_images/1757698978060374016/arhSr8o2_400x400.jpg"
        alt="avatar"
      />
      <div class="flex-1 p-2">
        <textarea
          @drop="
            (e) => {
              e.preventDefault()
              if (!e.dataTransfer) return
              readFile(e.dataTransfer.files)
            }
          "
          @dragover="
            () => {
              isDragOver = true
            }
          "
          @dragleave="
            () => {
              isDragOver = false
            }
          "
          :class="`placeholder-gray-400 w-full bg-transparent focus:outline-none border-dashed rounded-md p-2 resize-none border-2 ${isDragOver ? 'border-blue-500' : 'border-transparent'}`"
          placeholder="有什麼新鮮事？！"
          :rows="numberOfLineBreaks"
          v-model="postContent"
          @input="shrinkTextareaRows"
        >
        </textarea>
        <img
          class="rounded-xl w-full p-2"
          v-if="imgSrc"
          :src="imgSrc"
          @click="
            () => {
              imgSrc = ''
            }
          "
        />
        <div class="flex border-t-[1px] border-gray-700 pt-4">
          <div class="flex items-center">
            <div>
              <div
                @click="
                  () => {
                    if (imageInput) imageInput.click()
                  }
                "
              >
                Upload SVG
              </div>
              <input
                ref="imageInput"
                class="w-0 h-0"
                type="file"
                @change="
                  (e) => {
                    if (!e.target) return
                    readFile((e.target as HTMLInputElement).files)
                  }
                "
              />
            </div>
          </div>
          <div class="flex-1 flex justify-end items-center">
            <button
              :disabled="!postContent && !imgSrc"
              :class="`${!postContent && !imgSrc ? 'bg-blue-400' : 'bg-blue-500'} hover:bg-blue-500 rounded-full h-10 py-1 px-4 disabled:pointer-events-none`"
              @click="
                () => {
                  mutate({
                    content: postContent,
                    imageSrc: imgSrc,
                    authorId: 1
                  })
                }
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
