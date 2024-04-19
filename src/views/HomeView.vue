<script setup lang="ts">
import NewPostTextArea from '@/components/NewPostTextArea/NewPostTextArea.vue'
import PostFeed from '@/components/PostFeed.vue'
import Category from '@/components/Category.vue'
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <Category />
    <NewPostTextArea />
    <PostFeed />
  </div>
</template>
