<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'

const { targetUserId, follower } = defineProps<{
  targetUserId: string
  follower: { follower: string }[]
}>()
const userStore = useUserStore()
const isFollowing = ref(follower.some(({ follower }) => follower === userStore.user.id))

// Rules to prevent duplicated relationship is set in database CONSTRAINT
async function followUser() {
  const { error } = await supabase
    .from('follows')
    .insert({ followee: targetUserId, follower: userStore.user.id })
  if (error) throw new Error(error.message)
  isFollowing.value = true
}

async function unfollowUser() {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('followee', targetUserId)
    .eq('follower', userStore.user.id)
  if (error) throw new Error(error.message)
  isFollowing.value = false
}
</script>

<template>
  <div class="py-2 w-24">
    <Button @click="followUser" v-if="!isFollowing" class="w-full">追隨</Button>
    <Button @click="unfollowUser" v-if="isFollowing" class="w-full bg-secondary duration-300"
      >取消追隨</Button
    >
  </div>
</template>
