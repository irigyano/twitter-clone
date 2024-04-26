<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import PasswordInput from '@/components/Sign/PasswordInput.vue'
const router = useRouter()

const email = ref('aintnoway@w.com')
const password = ref('AINTNOWAY')
const authError = ref('')

async function SignIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (error) return (authError.value = error.message)
  router.replace('/')
}

watch([email, password], () => (authError.value = ''))
</script>

<template>
  <form @submit.prevent="SignIn">
    <div class="grid gap-2">
      <div class="grid gap-1">
        <Label for="email">電子郵件</Label>
        <Input
          required
          @input="authError = ''"
          v-model="email"
          id="email"
          placeholder="aintnoway@w.com"
          type="email"
        />
        <PasswordInput v-model="password" />
      </div>
      <p v-if="authError" class="text-red-500">帳號或密碼錯誤。</p>
      <Button>登入</Button>
    </div>
    <p class="p-4 text-center text-sm text-muted-foreground">
      還沒有帳戶嗎？<RouterLink to="signup" class="text-primary">註冊</RouterLink>
    </p>
  </form>
</template>
