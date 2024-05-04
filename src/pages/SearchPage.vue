<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import PageNav from '@/components/Layout/PageNav.vue'
import { getPostsByTextSearch } from '@/utils/services'
import { useQuery } from '@tanstack/vue-query'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Post from '@/components/Post/Post.vue'
import SearchBar from '@/components/SearchBar.vue'
const route = useRoute()

const {
  isLoading,
  data: tweets,
  error
} = useQuery({
  queryKey: ['SearchTweets'],
  queryFn: () => getPostsByTextSearch(route.query.q as string),
  retry: false,
  // Cache would cause mismatch if using same queryKey for every search.
  gcTime: 0
})

useHead({
  title: route.query.q ? `${route.query.q} - 搜尋 / W` : '搜尋 / W'
})
</script>

<template>
  <div class="flex flex-col w-full">
    <PageNav :title="`搜尋`">
      <div class="text-muted-foreground">
        {{ route.query.q }}
      </div>
    </PageNav>
    <div class="p-4 lg:hidden">
      <SearchBar />
    </div>

    <div v-if="tweets?.length" class="border-t-[1px]">
      <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
    </div>

    <div v-else class="flex-1 flex items-center justify-center text-2xl font-bold">
      <LoadingSpinner v-if="isLoading" />
      <div v-else-if="error"></div>
      <div v-else>找不到 {{ route.query.q }} 的結果。</div>
    </div>
  </div>
</template>
