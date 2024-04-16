<script setup lang="ts">
import { RouterLink } from 'vue-router'
import UserAuthForm from '@/components/UserAuthForm.vue'
</script>

<template>
  <div
    class="container relative flex h-[800px] flex-col items-center justify-center lg:max-w-none lg:px-0"
  >
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">TBD: ads intro</h1>
        </div>
        <UserAuthForm />
        <p class="px-8 text-center text-sm text-muted-foreground">
          還沒有帳戶嗎？<RouterLink to="/signup" class="text-primary">註冊</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
