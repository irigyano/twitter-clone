<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { cn } from '@/utils/shadcn'
import { useQueryClient } from '@tanstack/vue-query'
import { followUser, unfollowUser } from '@/utils/actions'
const queryClient = useQueryClient()

const props = defineProps<{
  targetUserId: string
  followers: { follower: string }[]
  class?: HTMLAttributes['class']
}>()

const userStore = useUserStore()
const isFollowing = ref(props.followers.some(({ follower }) => follower === userStore.user.id))

async function follow() {
  if (isFollowing.value) {
    await unfollowUser(userStore.user.id, props.targetUserId)
  } else {
    await followUser(userStore.user.id, props.targetUserId)
  }
  // Toggle state for UserPage since we don't invalidate page cache here
  isFollowing.value = !isFollowing.value

  queryClient.invalidateQueries({ queryKey: ['userRelation'] })
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
