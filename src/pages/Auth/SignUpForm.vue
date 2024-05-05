<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import PasswordInput from '@/pages/Auth/PasswordInput.vue'
const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')
const authError = ref('')

async function SignUp() {
  // Remove all the whitespaces, maybe set it in db in the future.
  const emailT = removeWhitespaces(email.value)
  const pwT = removeWhitespaces(password.value)
  const usernameT = removeWhitespaces(username.value)
  const { error } = await supabase.auth.signUp({
    email: emailT,
    password: pwT,
    options: {
      data: {
        username: usernameT,
        tag: usernameT
      }
    }
  })

  if (error) {
    switch (error.status) {
      case 422:
        authError.value = '電子郵件已被使用。'
        break
      case 500:
        authError.value = '使用者名稱已被使用。'
        break
      default:
        authError.value = error.message
    }
  } else {
    return router.replace('/')
  }
}

function removeWhitespaces(s: string) {
  return s.replaceAll(' ', '')
}

watch(email, (newEmail, oldEmail) => {
  const oldAutoUsername = oldEmail.split('@')[0]
  if (username.value === '' || username.value === oldAutoUsername) {
    const newAutoUsername = newEmail.split('@')[0]
    username.value = newAutoUsername
  }
})

watch([email, username, password], () => (authError.value = ''))
</script>

<template>
  <form @submit.prevent="SignUp">
    <div class="grid gap-2">
      <div class="grid gap-1">
        <Label for="email">電子郵件</Label>
        <Input required v-model="email" id="email" placeholder="aintnoway@w.com" type="email" />
        <Label for="username">使用者名稱</Label>
        <Input required v-model="username" id="username" type="text" />
        <PasswordInput v-model="password" />
      </div>
      <p v-if="authError" class="text-red-500">{{ authError }}</p>
      <Button class="bg-primary">註冊</Button>
    </div>
    <p class="pt-4 text-center text-sm text-muted-foreground">
      <RouterLink to="signin" class="text-primary">已經有一個帳號？</RouterLink>
    </p>
  </form>
</template>
