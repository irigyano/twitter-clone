<script setup lang="ts">
import PostSubmission from '@/components/PostSubmission/PostSubmission.vue'
import Category from '@/components/Layout/Category.vue'
import TweetsFeed from '@/pages/Home/TweetsFeed.vue'
import FollowFeed from '@/pages/Home/FollowFeed.vue'
import { ref } from 'vue'
const showFollow = ref(false)
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <Category v-model="showFollow" />
    <PostSubmission />
    <TweetsFeed v-if="!showFollow" />
    <FollowFeed v-if="showFollow" />
  </div>
</template>
