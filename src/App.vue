<script setup lang="ts">
import { RouterView } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import TimeAgo from 'javascript-time-ago'
import zh from 'javascript-time-ago/locale/zh-Hant'
TimeAgo.addDefaultLocale(zh)
const router = useRouter()
const userStore = useUserStore()

supabase.auth.onAuthStateChange((event, session) => {
  // reload the page if current session expired
  if (userStore.session && !session) return router.go(0)

  // update the session
  userStore.session = session
  // for better ux, we can also refetch and update user here,
  // so changing avatar, username would reflect immediately.
  // ...
})
</script>

<template>
  <div class="min-h-[100dvh] flex justify-center">
    <RouterView />
  </div>
</template>
