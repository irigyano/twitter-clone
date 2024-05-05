<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { cn } from '@/utils/shadcn'
import { followUser, unfollowUser } from '@/utils/actions'
const userStore = useUserStore()
const { targetUserId } = defineProps<{
  targetUserId: string
  class?: HTMLAttributes['class']
}>()

const isFollowing = computed(() => userStore.getIsFollowing(targetUserId))

// Optimistic Experiment
async function handleFollowClick() {
  if (isFollowing.value) {
    // Update UI first
    userStore.removeFollowing(targetUserId)
    try {
      await unfollowUser(userStore.user.id, targetUserId)
    } catch (error) {
      // If error, revert UI
      userStore.addFollowing(targetUserId)
    }
  } else {
    userStore.addFollowing(targetUserId)
    try {
      await followUser(userStore.user.id, targetUserId)
    } catch (error) {
      userStore.removeFollowing(targetUserId)
    }
  }
}
</script>

<template>
  <div :class="cn('py-2 w-24', $props.class)" v-if="targetUserId !== userStore.user.id">
    <Button
      @click="handleFollowClick"
      class="w-full duration-300"
      :class="isFollowing && 'bg-secondary'"
      >{{ isFollowing ? '正在跟隨' : '跟隨' }}</Button
    >
  </div>
</template>
