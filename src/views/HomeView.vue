<script setup lang="ts">
import NewPostTextArea from '@/components/NewPostTextArea.vue'
import PostFeed from '@/components/PostFeed.vue'
import Category from '@/components/Category.vue'
import MobileNav from '@/components/Mobile/MobileNav.vue'
</script>

<template>
  <div class="flex flex-col items-center">
    <MobileNav />
    <Category />
    <NewPostTextArea />
    <PostFeed />
  </div>
</template>
