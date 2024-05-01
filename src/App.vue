<script setup lang="ts">
import { RouterView } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import TimeAgo from 'javascript-time-ago'
import zh from 'javascript-time-ago/locale/zh-Hant'
import Toaster from '@/components/ui/toast/Toaster.vue'
TimeAgo.addDefaultLocale(zh)
const router = useRouter()
const userStore = useUserStore()

supabase.auth.onAuthStateChange((event, session) => {
  // Reload page if session expired so user redirect to Login
  if (userStore.session && !session) return router.go(0)

  // Update the session
  userStore.session = session
})
</script>

<template>
  <div class="min-h-[100dvh] flex justify-center">
    <RouterView />
  </div>
  <Toaster />
</template>
