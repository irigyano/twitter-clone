<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from 'unhead'
import Post from '@/components/Post.vue'
import Loading from '@/components/Loading.vue'
import { useQuery } from '@tanstack/vue-query'
import { getUserWithTag } from '@/utils/query'
const route = useRoute()

const {
  isLoading,
  isError,
  data: user,
  error
} = useQuery({
  queryKey: ['userPosts'],
  queryFn: async () => {
    const data = await getUserWithTag(route.params.user as string)
    useHead({
      title: `${data.name} (@${data.tag}) / Webber`
    })
    return data
  },
  gcTime: 0
})
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
  >
    <Loading />
  </div>
  <div v-if="isError">{{ error }}</div>
  <!-- Q: better approach than w-full? -->
  <div v-if="user" class="g-red-500 w-full">
    <div>{{ user.name }}</div>
    <div class="bg-blue-500">banner</div>
    <div class="bg-green-500 flex justify-between">
      <div>avatar</div>
      <div>edit button</div>
    </div>
    <div>{{ user.name }}</div>
    <div>@{{ user.tag }}</div>
    <pre>{{ user.bio || 'no bio' }}</pre>
    <div>{{ user.created_at }}</div>
    <div class="flex gap-2 border-b-[1px] border-border">
      <div>following</div>
      <div>followers</div>
    </div>
    <div class="flex flex-col">
      <!-- n starts with 1 -->
      <Post
        v-for="n in user.posts.length"
        :author="user"
        :post="user.posts[n - 1]"
        :key="user.posts[n - 1].id"
      />
    </div>
    <div v-if="user.posts.length === 0">The user has no posts yet.</div>
  </div>
</template>
