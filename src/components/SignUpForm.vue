<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { cn } from '@/utils/shadcn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

const email = ref('')
const username = ref('')
const tag = ref('')
const password = ref('')
const authError = ref('')

async function SignUp() {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: username.value,
        tag: tag.value
      }
    }
  })

  if (error) return alert(JSON.stringify(error))

  return router.replace('/')
}
</script>

<template>
  <form @submit.prevent="SignUp">
    <div class="grid gap-2">
      <div class="grid gap-1">
        <Label for="email">電子郵件</Label>
        <Input v-model="email" id="email" placeholder="name@example.com" type="email" />
        <Label for="username">使用者名稱</Label>
        <Input v-model="username" id="username" type="text" />
        <!-- validate no whtiespace -->
        <Label for="tag">Tag</Label>
        <Input v-model="tag" id="tag" type="text" />
        <Label for="password">密碼</Label>
        <Input v-model="password" id="password" minlength="6" type="password" />
      </div>
      <Button class="bg-primary">註冊</Button>
    </div>
    {{ authError }}
  </form>

  <p class="pt-4 text-center text-sm text-muted-foreground">
    <RouterLink to="signin" class="text-primary">已經有一個帳號？</RouterLink>
  </p>
</template>

<!-- TODO: validate if tag exists -->
