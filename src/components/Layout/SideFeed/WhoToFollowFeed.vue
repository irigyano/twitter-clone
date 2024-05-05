<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useQuery } from '@tanstack/vue-query'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/UserAvatar.vue'
import FollowButton from '@/components/FollowButton.vue'
import { getUnfollowByUserId } from '@/utils/rpc'
const userStore = useUserStore()
const router = useRouter()

const { isLoading, data: users } = useQuery({
  queryKey: ['WhoToFollow'],
  queryFn: () => getUnfollowByUserId(userStore.user.id)
})
</script>

<template>
  <div class="border-[1px] py-4 rounded-2xl">
    <div v-if="isLoading" class="h-10">
      <LoadingSpinner />
    </div>

    <div v-else class="flex flex-col">
      <div class="text-xl font-bold p-2 px-4">跟隨誰</div>
      <div
        v-if="users?.length"
        v-for="user in users"
        :key="user.tag"
        @click.stop="router.push(`/${user.tag}`)"
        class="flex items-center hover:bg-secondary duration-300 cursor-pointer gap-2 p-3"
      >
        <UserAvatar :avatar="user.avatar" :tag="user.tag" />
        <div class="leading-5 truncate flex-1">
          <div class="font-bold truncate">{{ user.name }}</div>
          <div class="text-muted-foreground">@{{ user.tag }}</div>
        </div>
        <FollowButton @click.stop :targetUserId="user.id" class="w-20" />
      </div>
    </div>
  </div>
</template>
