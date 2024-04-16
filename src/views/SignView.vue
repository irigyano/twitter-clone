<script setup lang="ts">
import SignUpForm from '@/components/SignUpForm.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div
    class="container relative flex h-[800px] flex-col items-center justify-center lg:max-w-none lg:px-0"
  >
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">註冊</h1>
          <p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
        </div>
        <SignUpForm />
        <p class="px-8 text-center text-sm text-muted-foreground">
          <RouterLink to="/login" class="text-primary">已經有一個帳號？</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
