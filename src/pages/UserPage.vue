<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import Loading from '@/components/Loading.vue'
import { useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import TimeAgo from 'javascript-time-ago'
import { useUserStore } from '@/stores/user'
import { defaultAvatar } from '@/utils/defaultAvatar'
import EditPanel from '@/components/User/EditPanel.vue'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import PageNav from '@/components/Layout/PageNav.vue'
import FollowButton from '@/components/FollowButton.vue'
import UserTweets from '@/components/User/UserTweets.vue'
import { getUserMetaByTag } from '@/utils/services'
import Typographer from '@/components/Typographer.vue'
const userStore = useUserStore()
const route = useRoute()
const timeAgo = new TimeAgo('zh-TW')

const {
  isLoading,
  isError,
  data: user
} = useQuery({
  queryKey: [route.params.user + 'UserMeta'],
  queryFn: () => getUserMetaByTag(route.params.user as string),
  retry: false
})

useHead({
  title: () => {
    if (!user.value) return ''
    return `${user.value.name} (@${user.value.tag}) / W`
  }
})
</script>

<template>
  <!-- DRY -->
  <div v-if="isLoading" class="w-full flex items-center justify-center">
    <Loading />
  </div>

  <div v-else-if="isError" class="flex justify-center flex-1 items-center">
    <div>嗯…此頁面不存在。請嘗試搜尋其他內容。</div>
  </div>

  <div v-else-if="user" class="flex-1 flex-col flex">
    <PageNav :title="user.name">
      <div class="text-muted-foreground">{{ user.posts.length + user.retweets.length }} 則貼文</div>
    </PageNav>

    <!-- Cover -->
    <div class="bg-secondary">
      <div class="relative pb-[33%] overflow-hidden">
        <img
          v-if="user.background_cover"
          class="h-full w-full object-cover absolute"
          :src="user.background_cover"
        />
        <div v-else class="h-full w-full object-cover absolute"></div>
      </div>
    </div>

    <!-- User Meta -->
    <div class="px-4 border-b-[1px] border-border flex flex-col gap-1 pb-4">
      <div class="flex justify-between relative h-14">
        <div>
          <img
            class="absolute rounded-full border-secondary object-cover border-2 aspect-square h-28 -top-full"
            :src="user.avatar || defaultAvatar"
          />
        </div>
        <Dialog v-if="user.id === userStore.user.id">
          <DialogTrigger>
            <div class="py-2">
              <Button>編輯個人資料</Button>
            </div>
          </DialogTrigger>
          <EditPanel :user="user" />
        </Dialog>
        <FollowButton :target-user-id="user.id" :followers="user.follower" />
      </div>
      <div class="leading-none">
        <div class="font-bold text-lg">{{ user.name }}</div>
        <div class="text-muted-foreground">@{{ user.tag }}</div>
      </div>
      <Typographer class="py-3" :content="user.bio" />
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

    <UserTweets />
  </div>
</template>
