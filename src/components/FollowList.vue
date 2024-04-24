<script setup lang="ts">
import PostAvatar from '@/components/PostAvatar.vue'
import type { UserWithRelation } from '@/utils/query'
import FollowButton from './FollowButton.vue'
defineProps<{ targetUserFollows: UserWithRelation[] }>()
</script>

<template>
  <div v-for="{ user } in targetUserFollows" class="flex flex-col gap-2 p-4">
    <!-- useless type checking for non null -->
    <div v-if="user" class="flex gap-2">
      <PostAvatar :avatar="user.avatar" :tag="user.tag" />
      <div class="flex-1">
        <div class="flex justify-between items-center pb-1">
          <div>
            <RouterLink :to="`/${user.tag}`" class="font-bold hover:underline cursor-pointer">{{
              user.name
            }}</RouterLink>
            <div class="text-muted-foreground leading-4">@{{ user.tag }}</div>
          </div>
          <FollowButton :target-user-id="user.id" :follower="user.follows" class="py-0" />
        </div>
        {{ user.bio }}
      </div>
    </div>
  </div>
</template>
