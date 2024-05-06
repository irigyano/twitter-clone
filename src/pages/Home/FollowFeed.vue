<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/Post/Post.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useUserStore } from '@/stores/user'
import { getTweets } from '@/utils/services'
import wideTime from '@/assets/images/widetime.gif'
import type { Tweet } from '@/types/queries'
const userStore = useUserStore()

function filterFollowing(tweets: Tweet[] | undefined) {
  if (!tweets) return []

  const currFollows = userStore.user.follows
  const followedTweets: Tweet[] = []

  for (let tweet of tweets) {
    let targetUserId = ''
    if (tweet.isRetweet) targetUserId = tweet.retweeter.id
    else targetUserId = tweet.author.id

    const isFollow = currFollows.find(({ followee }) => followee === targetUserId)
    if (isFollow || targetUserId === userStore.user.id) followedTweets.push(tweet)
  }

  return followedTweets
}

const { isLoading, data: tweets } = useQuery({
  queryKey: ['tweets'],
  queryFn: getTweets
})
</script>

<template>
  <LoadingSpinner v-if="isLoading" class="h-0 flex-1" />
  <div v-else-if="filterFollowing(tweets).length" class="w-full flex flex-col">
    <Post v-for="tweet in filterFollowing(tweets)" :tweet="tweet" :key="tweet.id" />
  </div>
  <div v-else class="flex flex-col justify-center flex-1 w-full items-center gap-2">
    <img :src="wideTime" width="380" height="128" alt="widetime" class="w-full" />
    <div class="font-bold text-2xl">還沒有可查看的資訊</div>
    <span class="text-sm text-muted-foreground">追隨更多內容，你就會在這裡看到。</span>
  </div>
</template>
