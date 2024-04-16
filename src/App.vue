<script setup lang="ts">
import { RouterView } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
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
  <div class="min-h-screen bg-slate-800 text-gray-300 flex justify-center">
    <RouterView />
  </div>
</template>
