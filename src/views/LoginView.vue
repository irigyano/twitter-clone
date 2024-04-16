<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
const router = useRouter()

async function SignIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'test'
  })

  if (!error) router.replace('/')
}
</script>

<template>
  <button @click="SignIn()">登入</button>
</template>
