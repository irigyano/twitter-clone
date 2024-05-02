<script setup lang="ts">
import PostAvatar from '@/components/UserAvatar.vue'
defineProps<{ avatar: string | null; tag: string; name: string; isRead: boolean }>()
</script>

<template>
  <div class="flex border-t-[1px] p-2" :class="isRead ? 'bg-background' : 'bg-secondary'">
    <div class="p-2">
      <slot name="svg" />
    </div>
    <div>
      <PostAvatar :avatar="avatar" :tag="tag" />
      <div class="break-all">
        <RouterLink :to="`/${tag}`" class="font-bold hover:underline">{{ name }}</RouterLink>
        <slot name="text" />
      </div>
    </div>
  </div>
</template>
