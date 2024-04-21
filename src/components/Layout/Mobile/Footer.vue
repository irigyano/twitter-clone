<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SignOutButton from '@/components/SignOutButton.vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<template>
  <div
    class="fixed bottom-0 w-full flex sm:hidden justify-between border-t-[1px] border-border items-center px-2 bg-background"
  >
    <RouterLink :to="userStore.user.tag">Me</RouterLink>
    <RouterLink to="/">Home</RouterLink>
    <SignOutButton />
  </div>
</template>
