<script setup lang="ts">
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/stores/user'
import { UserPlus, UserMinus } from 'lucide-vue-next'
import { followUser, unfollowUser } from '@/utils/actions'
import { computed } from 'vue'
const userStore = useUserStore()
const { authorId, authorTag } = defineProps<{ authorId: string; authorTag: string }>()

// computed is not needed here because the MenuItem would mount/unmount after click anyway.
const isFollowing = computed(() => userStore.getIsFollowing(authorId))

async function follow() {
  await followUser(userStore.user.id, authorId)
  userStore.addFollowing(authorId)
}

async function unfollow() {
  await unfollowUser(userStore.user.id, authorId)
  userStore.removeFollowing(authorId)
}
</script>

<template>
  <div v-if="userStore.user.id !== authorId">
    <DropdownMenuItem @click="follow" v-if="!isFollowing" class="cursor-pointer">
      <div class="flex items-center">
        <UserPlus class="mr-2 h-4 w-4" />
        <span>跟隨 @{{ authorTag }}</span>
      </div>
    </DropdownMenuItem>
    <DropdownMenuItem @click="unfollow" v-if="isFollowing" class="cursor-pointer">
      <div class="flex items-center">
        <UserMinus class="mr-2 h-4 w-4" />
        <span>取消跟隨 @{{ authorTag }}</span>
      </div>
    </DropdownMenuItem>
  </div>
</template>
