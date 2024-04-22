<script setup lang="ts">
import { defaultAvatar } from '@/utils/defaultAvatar'
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps<{ avatar: string | null; tag: string }>()
</script>

<template>
  <img
    alt="avatar"
    class="min-w-10 h-10 rounded-full object-cover cursor-pointer"
    width="40"
    height="40"
    :src="avatar || defaultAvatar"
    @click.stop="router.push(`/${tag}`)"
  />
</template>
