<script setup lang="ts">
import { ref } from 'vue'
import Post from '@/components/Post.vue'

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
  <div class="w-full flex flex-col gap-2 p-2">
    <Post
      v-for="post in posts"
      :content="post.content"
      :imageSrc="post.imageSrc"
      :author="post.author.name"
      :tag="post.author.tag"
      :avatar="post.author.avatar"
    />
  </div>
</template>
