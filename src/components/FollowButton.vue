<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { cn } from '@/utils/shadcn'
import { followUser, unfollowUser } from '@/utils/actions'
const userStore = useUserStore()
const props = defineProps<{
  class?: HTMLAttributes['class']
  targetUserId: string
}>()

// Find a way to validate and update pinia store after mutation.
// Also Q: can we directly use pinia arrays w/o creating a local ref?
const isFollowing = ref(
  userStore.user.follows.some(({ followee }) => followee === props.targetUserId)
)

async function follow() {
  if (isFollowing.value) {
    await unfollowUser(userStore.user.id, props.targetUserId)
  } else {
    await followUser(userStore.user.id, props.targetUserId)
  }
  // user page doesn't update in time now
  isFollowing.value = !isFollowing.value
}
</script>

<template>
  <div :class="cn('py-2 w-24', props.class)" v-if="props.targetUserId !== userStore.user.id">
    <Button @click="follow" v-if="!isFollowing" class="w-full">追隨</Button>
    <Button @click="follow" v-if="isFollowing" class="w-full bg-secondary duration-300"
      >正在追隨</Button
    >
  </div>
</template>
