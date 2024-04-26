<script setup lang="ts">
import NewPostTextArea from '@/components/NewPostTextArea/NewPostTextArea.vue'
import PostFeed from '@/components/Post/PostFeed.vue'
import Category from '@/components/Layout/Category.vue'
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <Category />
    <NewPostTextArea />
    <PostFeed />
  </div>
</template>
