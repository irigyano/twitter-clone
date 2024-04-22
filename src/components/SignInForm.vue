<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

const email = ref('guest1@example.com')
const password = ref('guest1')
const authError = ref('')

async function SignIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (error) return (authError.value = error.message)
  router.replace('/')
}
</script>

<template>
  <form @submit.prevent="SignIn">
    <div class="grid gap-2">
      <div class="grid gap-1">
        <Label class="sr-only" for="email"> Email </Label>
        <Input v-model="email" id="email" placeholder="name@example.com" type="email" />
        <Label class="sr-only" for="password"> Password </Label>
        <Input v-model="password" id="password" placeholder="name@example.com" type="password" />
      </div>
      <Button class="bg-primary">登入</Button>
    </div>
    <!-- fix style -->
    {{ authError }}
  </form>
</template>
