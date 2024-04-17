<script setup lang="ts">
import SideNavItem from '@/components/SideNavItem.vue'
import { Home, UserRound, Bell } from 'lucide-vue-next'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
const router = useRouter()
const { user } = useUserStore()

async function signOut() {
  await supabase.auth.signOut()
  router.go(0)
}
</script>

<template>
  <header class="hidden sm:flex flex-[0.25]">
    <div
      class="flex w-full flex-col items-end pr-8 border-r-[1px] border-gray-700 pt-4 justify-between h-[100dvh] sticky top-0"
    >
      <div class="w-1/2 flex flex-col gap-2">
        <RouterLink
          to="/"
          class="hover:bg-gray-400 p-1 rounded-full duration-300 hover:bg-opacity-50 self-start"
        >
          <img class="w-10 rounded-full" src="/src/assets//images/garf.webp" />
        </RouterLink>
        <SideNavItem location="/" title="首頁">
          <Home :size="24" />
        </SideNavItem>
        <SideNavItem :location="`/notifications`" title="通知">
          <Bell :size="24" />
        </SideNavItem>
        <SideNavItem :location="`/${user.tag}`" title="個人資料">
          <UserRound :size="24" />
        </SideNavItem>
      </div>
      <div class="w-1/2 flex items-center gap-2">
        <img :src="user.avatar || ''" class="rounded-full w-10 h-10 object-cover" />
        <div>
          <div>{{ user.name }}</div>
          <div class="text-muted-foreground">@{{ user.tag }}</div>
        </div>
        <button class="hover:text-blue-400 duration-300" @click="signOut()">登出</button>
      </div>
    </div>
  </header>
</template>
