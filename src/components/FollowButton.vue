<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { cn } from '@/utils/shadcn'
import { followUser, unfollowUser } from '@/utils/actions'
const userStore = useUserStore()
const { targetUserId } = defineProps<{
  class?: HTMLAttributes['class']
  targetUserId: string
}>()

const isFollowing = computed(() => userStore.getIsFollowing(targetUserId))

async function follow() {
  await followUser(userStore.user.id, targetUserId)
  userStore.addFollowing(targetUserId)
}

async function unfollow() {
  await unfollowUser(userStore.user.id, targetUserId)
  userStore.removeFollowing(targetUserId)
}
</script>

<template>
  <div :class="cn('py-2 w-24', $props.class)" v-if="targetUserId !== userStore.user.id">
    <Button @click="follow" v-if="!isFollowing" class="w-full">跟隨</Button>
    <Button @click="unfollow" v-if="isFollowing" class="w-full bg-secondary duration-300"
      >正在跟隨</Button
    >
  </div>
</template>
