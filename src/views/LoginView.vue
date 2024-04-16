<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
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
  <Button @click="SignIn()">Click me</Button>
</template>
