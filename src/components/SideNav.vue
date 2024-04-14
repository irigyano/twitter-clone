<script setup lang="ts">
import SideNavItem from '@/components/SideNavItem.vue'
import { Home, UserRound } from 'lucide-vue-next'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
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
        <div>Logo</div>
        <SideNavItem location="/" title="首頁">
          <Home :size="24" />
        </SideNavItem>
        <SideNavItem location="/sense" title="個人資料">
          <UserRound :size="24" />
        </SideNavItem>
      </div>
      <div class="w-1/2 flex flex-col gap-2">
        <div>{{ user.name }}</div>
        <button @click="signOut()">登出</button>
      </div>
    </div>
  </header>
</template>
