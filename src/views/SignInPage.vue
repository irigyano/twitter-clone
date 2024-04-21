<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SignInForm from '@/components/SignInForm.vue'
import nuxt from '@/assets/images/nuxt.png'
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col justify-center space-y-6 max-w-[300px] mx-auto">
      <h1 class="flex flex-col space-y-2 text-center">
        <img :src="nuxt" alt="" />
      </h1>
      <SignInForm />
      <p class="px-8 text-center text-sm text-muted-foreground">
        還沒有帳戶嗎？<RouterLink to="/signup" class="text-primary">註冊</RouterLink>
      </p>
    </div>
  </div>
</template>
