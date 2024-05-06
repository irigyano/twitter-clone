<script setup lang="ts">
import SideNavItem from '@/components/Layout/SideNavItem.vue'
import { Home, UserRound, Bell, Search } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import SignOutButton from '@/components/SignOutButton.vue'
import PostAvatar from '@/components/UserAvatar.vue'
import PostSubmissionDialog from '@/components/PostSubmission/PostSubmissionDialog.vue'
import { useQuery } from '@tanstack/vue-query'
import { getNotificationsByUserId } from '@/utils/services'
const router = useRouter()
const { user } = useUserStore()

const { data: notifications } = useQuery({
  queryKey: ['Notifications'],
  queryFn: () => getNotificationsByUserId(user.id),
  retry: false
})
</script>

<template>
  <header class="hidden sm:block">
    <div class="p-4 flex flex-col justify-between h-[100dvh] sticky top-0">
      <div class="flex flex-col gap-2 items-center xl:items-start font-bold">
        <RouterLink
          to="/"
          class="hover:bg-secondary p-1 rounded-full duration-300 hover:bg-opacity-50 self-start"
        >
          <img class="w-10 rounded-full" src="/src/assets//images/garf.webp" />
        </RouterLink>
        <SideNavItem location="/" title="首頁">
          <Home :size="24" />
        </SideNavItem>
        <SideNavItem :location="`/notifications`" title="通知">
          <div class="relative">
            <Bell :size="24" />
            <div
              v-if="notifications?.find(({ is_read }) => !is_read)"
              class="absolute top-0 right-0 bg-red-500 rounded-full h-1 w-1"
            ></div>
          </div>
        </SideNavItem>
        <SideNavItem :location="`/${user.tag}`" title="個人資料">
          <UserRound :size="24" />
        </SideNavItem>
        <SideNavItem :location="`/search`" title="" class="block lg:hidden">
          <Search :size="24" />
        </SideNavItem>
        <PostSubmissionDialog />
      </div>

      <div class="flex flex-col items-center gap-2">
        <SignOutButton class="xl:hidden" />

        <div
          @click.stop="router.push(`/${user.tag}`)"
          class="flex items-center gap-2 hover:bg-secondary p-2 rounded-full duration-300 cursor-pointer"
        >
          <PostAvatar :avatar="user.avatar" :tag="user.tag" static />
          <div class="hidden xl:flex gap-2 leading-5">
            <div class="w-36">
              <div class="font-bold truncate">{{ user.name }}</div>
              <div class="text-muted-foreground">@{{ user.tag }}</div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
