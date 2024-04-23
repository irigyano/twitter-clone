<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SignInForm from '@/components/SignInForm.vue'
import vue from '@/assets/images/Vue.png'
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col justify-center max-w-[300px] mx-auto">
      <img :src="vue" alt="vue_logo" width="1920" height="1080" />
      <SignInForm />
      <p class="pt-4 text-center text-sm text-muted-foreground">
        還沒有帳戶嗎？<RouterLink to="/signup" class="text-primary">註冊</RouterLink>
      </p>
    </div>
  </div>
</template>
