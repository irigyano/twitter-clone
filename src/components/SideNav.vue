<script setup lang="ts">
import SideNavItem from '@/components/SideNavItem.vue'
import { supabase } from '@/utils/supabase'
import { Home, UserRound } from 'lucide-vue-next'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
async function SignOut() {
  const { error } = await supabase.auth.signOut()
  router.go(0)
}

const username = ref<string>()
// we can call this as soon as have access to localStorage.
onBeforeMount(async () => {
  // we get session from pinia in the future
  const {
    data: { session }
  } = await supabase.auth.getSession()

  // is `Session` possibly null?
  const { user } = session!
  const { data } = await supabase.from('users').select(`name , tag`).eq('id', user.id).single()
  username.value = data!.name
})
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
      <div v-if="username" class="w-1/2 flex flex-col gap-2">
        <div>{{ username }}</div>
        <button @click="SignOut()">登出</button>
      </div>
    </div>
  </header>
</template>
