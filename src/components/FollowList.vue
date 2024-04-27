<script setup lang="ts">
import PostAvatar from '@/components/PostAvatar.vue'
import FollowButton from './FollowButton.vue'
import type { FollowWithUser } from '@/types/queries'
defineProps<{ targetUserFollows: FollowWithUser[] }>()
</script>

<template>
  <div v-for="{ user, id } in targetUserFollows" class="flex flex-col gap-2 p-4" :key="id">
    <div class="flex gap-2">
      <PostAvatar :avatar="user.avatar" :tag="user.tag" />
      <div class="flex-1">
        <div class="flex justify-between items-center pb-1">
          <div>
            <RouterLink :to="`/${user.tag}`" class="font-bold hover:underline cursor-pointer">{{
              user.name
            }}</RouterLink>
            <div class="text-muted-foreground leading-4">@{{ user.tag }}</div>
          </div>
          <FollowButton :target-user-id="user.id" :followers="user.follows" class="py-0" />
        </div>
        {{ user.bio }}
      </div>
    </div>
  </div>
</template>
