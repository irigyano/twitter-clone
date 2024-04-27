<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from 'unhead'
import Post from '@/components/Post/Post.vue'
import Loading from '@/components/Loading.vue'
import { useQuery } from '@tanstack/vue-query'
import { getUserWithTag } from '@/utils/query'
import { Button } from '@/components/ui/button'
import TimeAgo from 'javascript-time-ago'
import UploadCoverButton from '@/components/User/UploadCoverButton.vue'
import { useUserStore } from '@/stores/user'
import { defaultAvatar } from '@/utils/defaultAvatar'
import EditPanel from '@/components/User/EditPanel.vue'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { computed } from 'vue'
import PageNav from '@/components/Layout/PageNav.vue'
import FollowButton from '@/components/FollowButton.vue'

const userStore = useUserStore()
const timeAgo = new TimeAgo('zh-TW')
const route = useRoute()

const {
  isLoading,
  isError,
  data: user
} = useQuery({
  queryKey: ['userPosts'],
  queryFn: async () => {
    const data = await getUserWithTag(route.params.user as string)
    useHead({
      title: `${data.name} (@${data.tag}) / W`
    })
    return data
  },
  gcTime: 0,
  retry: false
})

const isUserOwner = computed(() => user.value?.id === userStore.user.id)
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
  >
    <Loading />
  </div>

  <div v-if="isError" class="flex justify-center flex-1 items-center">
    <div>嗯…此頁面不存在。請嘗試搜尋其他內容。</div>
  </div>

  <div v-if="user" class="flex-1 flex-col flex">
    <PageNav :title="user.name">
      <div class="text-muted-foreground">{{ user.posts.length }} 則貼文</div>
    </PageNav>
    <div class="bg-secondary">
      <div class="relative pb-[33%] overflow-hidden">
        <UploadCoverButton v-if="isUserOwner" />
        <img
          v-if="user.background_cover"
          class="h-full w-full object-cover absolute"
          :src="user.background_cover"
        />
        <div v-else class="h-full w-full object-cover absolute"></div>
      </div>
    </div>

    <div class="px-4 border-b-[1px] border-border flex flex-col gap-1 pb-4">
      <div class="flex justify-between relative h-14">
        <div>
          <img
            class="absolute rounded-full border-secondary object-cover border-2 aspect-square h-28 -top-full"
            :src="user.avatar || defaultAvatar"
          />
        </div>
        <Dialog v-if="isUserOwner">
          <DialogTrigger>
            <div class="py-2">
              <Button>編輯個人資料</Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <EditPanel :user="user" />
          </DialogContent>
        </Dialog>
        <FollowButton :target-user-id="user.id" :followers="user.follower" />
      </div>
      <div class="leading-none">
        <div class="font-bold text-lg">{{ user.name }}</div>
        <div class="text-muted-foreground">@{{ user.tag }}</div>
      </div>
      <div class="py-3 whitespace-pre-wrap">
        {{ user.bio }}
      </div>
      <div class="text-muted-foreground text-sm">
        已加入 {{ timeAgo.format(new Date(user.created_at), 'twitter-minute-now') }}
      </div>
      <div class="flex gap-2 text-sm text-muted-foreground">
        <RouterLink class="hover:underline" :to="`/${user.tag}/following`">
          <span class="text-foreground font-bold">{{ user.following.length }}</span> 個跟隨中
        </RouterLink>
        <RouterLink class="hover:underline" :to="`/${user.tag}/followers`">
          <span class="text-foreground font-bold">{{ user.follower.length }}</span> 位跟隨者
        </RouterLink>
      </div>
    </div>
    <div class="flex flex-col">
      <!-- n starts with 1 -->
      <!-- <Post
        v-for="n in user.posts.length"
        :author="user"
        :post="user.posts[n - 1]"
        :key="user.posts[n - 1].id"
      /> -->
    </div>
    <div class="flex items-center justify-center text-3xl flex-1" v-if="user.posts.length === 0">
      <div>@{{ user.tag }} 尚未新增貼文</div>
    </div>
  </div>
</template>
