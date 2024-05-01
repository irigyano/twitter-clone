<script setup lang="ts">
import { defaultAvatar } from '@/utils/defaultAvatar'
defineProps<{ avatar: string | null; tag: string }>()
</script>

<template>
  <RouterLink @click.stop :to="`/${tag}`" class="inline-block">
    <img
      alt="avatar"
      class="w-10 h-10 rounded-full object-cover cursor-pointer hover:brightness-75 duration-300 border-[1px] bg-background"
      width="40"
      height="40"
      :src="avatar || defaultAvatar"
    />
  </RouterLink>
</template>
