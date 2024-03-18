<script setup lang="ts">
import { ref } from 'vue'
import NewPostTextArea from '@/components/NewPostTextArea.vue'
import Post from '../components/Post.vue'

type Post = {
  content?: string
  imageSrc?: string
  author: {
    name: string
    tag: string
    avatar?: string
  }
}
const posts = ref<Post[]>([])

const getData = async () => {
  try {
    let data = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/posts`)
    if (!data.ok) {
      throw Error('fetch data 失敗')
    }
    posts.value = await data.json()
  } catch (error: unknown) {
    console.log(error)
  }
}
getData()
</script>

<template>
  <div class="flex flex-col items-center">
    <NewPostTextArea />
    <!-- Posts -->
    <div class="w-full">
      <div v-for="post in posts">
        <Post
          :content="post.content"
          :imageSrc="post.imageSrc"
          :author="post.author.name"
          :tag="post.author.tag"
          :avatar="post.author.avatar"
        />
      </div>
    </div>
  </div>
</template>
