<script setup lang="ts">
import { ref } from 'vue'
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import axios from 'axios'

const queryClient = useQueryClient()

const postContent = defineModel<string>()
const numberOfLineBreaks = ref(5)

const { error, mutate, reset } = useMutation({
  mutationFn: (newPost: { content?: string; authorId: number }) => {
    const endpoint = `${import.meta.env.VITE_API_ENDPOINT}/posts`

    return axios.post(endpoint, newPost)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    postContent.value = ''
  }
})

function handleChange(event: Event) {
  // https://vuejs.org/guide/typescript/composition-api.html#typing-event-handlers
  const inputText = (event.target as HTMLInputElement).value
  const lineBreaks = (inputText.match(/\n/g) || []).length
  if (lineBreaks >= 5) numberOfLineBreaks.value = lineBreaks + 1
}
</script>

<template>
  <div class="hidden sm:block w-full">
    <div class="flex flex-shrink-0 p-4 pb-0 relative">
      <div class="w-12 flex items-top">
        <img
          class="inline-block h-10 w-10 rounded-full"
          src="https://pbs.twimg.com/profile_images/1757698978060374016/arhSr8o2_400x400.jpg"
          alt=""
        />
      </div>
      <div class="w-full p-2">
        <textarea
          class="placeholder-gray-400 w-full bg-transparent border-0 focus:outline-none resize-none"
          placeholder="有什麼新鮮事？！"
          :rows="numberOfLineBreaks"
          v-model="postContent"
          @input="handleChange"
        ></textarea>
        <div class="flex border-t-[1px] border-gray-700 pt-4">
          <div class="flex">
            <div>svg1</div>
            <div>1</div>
            <div>1</div>
          </div>
          <div class="flex-1 flex justify-end">
            <button
              :disabled="!postContent"
              class="bg-blue-400 hover:bg-blue-500 rounded-full py-1 px-4 disabled:pointer-events-none"
              @click="
                () => {
                  mutate({
                    content: postContent,
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
