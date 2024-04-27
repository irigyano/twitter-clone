<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/shadcn'

const props = defineProps<{
  targetUserId: string
  followers: { follower: string }[]
  class?: HTMLAttributes['class']
}>()

const userStore = useUserStore()
const isFollowing = ref(props.followers.some(({ follower }) => follower === userStore.user.id))

// Rules to prevent duplicated relationship is set in database CONSTRAINT
async function followUser() {
  const { error } = await supabase
    .from('follows')
    .insert({ followee: props.targetUserId, follower: userStore.user.id })
  if (error) throw new Error(error.message)
  isFollowing.value = true
}

async function unfollowUser() {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('followee', props.targetUserId)
    .eq('follower', userStore.user.id)
  if (error) throw new Error(error.message)
  isFollowing.value = false
}
</script>

<template>
  <div :class="cn('py-2 w-24', props.class)" v-if="props.targetUserId !== userStore.user.id">
    <Button @click="followUser" v-if="!isFollowing" class="w-full">追隨{{}}</Button>
    <Button @click="unfollowUser" v-if="isFollowing" class="w-full bg-secondary duration-300"
      >正在追隨</Button
    >
  </div>
</template>
