<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useHead } from 'unhead'
import Post from '@/components/Post.vue'
import Loading from '@/components/Loading.vue'
import { useQuery } from '@tanstack/vue-query'
import { getUserWithTag } from '@/utils/query'
import { Button } from '@/components/ui/button'
import TimeAgo from 'javascript-time-ago'
import { ChevronLeft } from 'lucide-vue-next'
import UploadBackgroundButton from '@/components/UploadBackgroundButton.vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const timeAgo = new TimeAgo('zh-TW')
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
  gcTime: 0,
  retry: false
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
  <div v-if="user">
    <div
      class="flex fixed w-full sm:sticky top-0 z-10 bg-background/50 backdrop-blur-md items-center"
    >
      <RouterLink to="/" class="p-4 hover:text-primary duration-300">
        <ChevronLeft :size="24" />
      </RouterLink>
      <div>
        <div class="font-bold">{{ user.name }}</div>
        <div class="text-muted-foreground">{{ user.posts.length }} 則貼文</div>
      </div>
    </div>
    <div class="relative bg-secondary pb-[33%] overflow-hidden">
      <UploadBackgroundButton v-if="userStore.user.tag === user.tag" />
      <img
        v-if="user.background_cover"
        class="h-full w-full object-cover absolute"
        :src="user.background_cover"
      />
      <div v-else class="h-full w-full object-cover absolute"></div>
    </div>
    <div class="px-4 border-b-[1px] border-border flex flex-col gap-1 pb-4">
      <div class="flex justify-between relative">
        <div>
          <img
            class="absolute rounded-full border-secondary object-cover border-2 aspect-square h-28 -top-full"
            :src="user.avatar!"
          />
        </div>
        <div class="py-2">
          <Button class="rounded-full text-foreground">編輯</Button>
        </div>
      </div>
      <div class="leading-none">
        <div class="font-bold text-lg">{{ user.name }}</div>
        <div class="text-muted-foreground">@{{ user.tag }}</div>
      </div>
      <div class="py-3">
        {{ user.bio }}lorem ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore
        est cumque inventore sequi sit saepe facere nobis nam nisi, iste assumenda officiis ut
        voluptates magnam magni totam? Corporis, neque deleniti.
      </div>
      <div class="text-muted-foreground text-sm">
        已加入 {{ timeAgo.format(new Date(user.created_at), 'twitter-minute-now') }}
      </div>
      <div class="flex gap-2 text-sm text-muted-foreground">
        <div>
          <span class="text-white">{{ 0 }}</span> 個跟隨中
        </div>
        <div>
          <span class="text-white">{{ 0 }}</span> 位追隨者
        </div>
      </div>
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
