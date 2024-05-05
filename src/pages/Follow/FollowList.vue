<script setup lang="ts">
import PostAvatar from '@/components/UserAvatar.vue'
import FollowButton from '@/components/FollowButton.vue'
import type { FollowWithUser } from '@/types/queries'
import Typographer from '@/components/Typographer.vue'
defineProps<{ targetUserFollows: FollowWithUser[] }>()
</script>

<template>
  <div v-for="{ user, id } in $props.targetUserFollows" class="flex flex-col gap-2 p-4" :key="id">
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
          <FollowButton class="py-0" :target-user-id="user.id" />
        </div>
        <Typographer :content="user.bio" :class="'whitespace-normal'" />
      </div>
    </div>
  </div>
</template>
