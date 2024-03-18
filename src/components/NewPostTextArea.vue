<script setup lang="ts">
import { ref } from 'vue'
const postContent = defineModel<string>()
const numberOfLineBreaks = ref(5)

function updatePost() {
  const endpoint = `${import.meta.env.VITE_API_ENDPOINT}/posts`

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: postContent.value,
      imageSrc:
        'https://i.ytimg.com/vi/ToDVsggNZ_Q/hq720.jpg?sqp=-oaymwEXCNUGEOADIAQqCwjVARCqCBh4INgESFo&rs=AMzJL3kg2R-xJd99BHFP703ik3MeaZzJOg'
    })
  }

  // Make the POST request
  fetch(endpoint, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      // Handle the response data
      console.log(data)
    })
    .catch((error) => {
      // Handle errors
      console.error('There was a problem with the fetch operation:', error)
    })
}

function handleChange(event: Event) {
  // https://vuejs.org/guide/typescript/composition-api.html#typing-event-handlers
  const inputText = (event.target as HTMLInputElement).value
  const lineBreaks = (inputText.match(/\n/g) || []).length
  if (lineBreaks >= 5) numberOfLineBreaks.value = lineBreaks + 1
}
</script>

<template>
  <div class="w-full">
    <div class="flex flex-shrink-0 p-4 pb-0">
      <div class="w-12 flex items-top">
        <img
          class="inline-block h-10 w-10 rounded-full"
          src="https://pbs.twimg.com/profile_images/1308769664240160770/AfgzWVE7_normal.jpg"
          alt=""
        />
      </div>
      <div class="w-full p-2">
        <textarea
          class="placeholder-gray-400 w-full bg-transparent border-0 focus:outline-none resize-none"
          placeholder="What's happening?"
          :rows="numberOfLineBreaks"
          v-model="postContent"
          @input="handleChange"
        ></textarea>
      </div>
      <button @click="updatePost">Sumbit</button>
    </div>
  </div>
</template>
