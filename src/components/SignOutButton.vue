<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'

const router = useRouter()

async function signOut() {
  await supabase.auth.signOut()
  router.go(0)
}
</script>

<template>
  <button
    class="hover:text-primary hover:bg-secondary rounded-full text-muted-foreground p-2 duration-300"
    @click.stop="signOut"
  >
    <LogOut />
  </button>
</template>
