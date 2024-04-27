<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import PageNav from '@/components/Layout/PageNav.vue'
import { getPostsByTextSearch } from '@/utils/services'
import { useQuery } from '@tanstack/vue-query'
import Loading from '@/components/Loading.vue'
import Post from '@/components/Post/Post.vue'
import SearchBar from '@/components/SearchBar.vue'
const route = useRoute()

const {
  isLoading,
  data: tweets,
  error
} = useQuery({
  queryKey: [route.query.q],
  queryFn: () => getPostsByTextSearch(route.query.q as string),
  retry: false
})

useHead({
  // if !route.query.q means redirected from mobile view
  title: route.query.q ? `${route.query.q} - 搜尋 / W` : '搜尋 / W'
})
</script>

<template>
  <div class="flex flex-col w-full">
    <PageNav :title="`搜尋`" />
    <div class="p-4 lg:hidden">
      <SearchBar />
    </div>

    <div v-if="tweets?.length" class="border-t-[1px]">
      <Post v-for="tweet in tweets" :tweet="tweet" :key="tweet.id" />
    </div>

    <div v-else class="flex-1 flex items-center justify-center">
      <Loading v-if="isLoading" />
      <div v-else-if="error" class="text-2xl font-bold"></div>
      <div v-else class="text-2xl font-bold">找不到 {{ route.query.q }} 的結果。</div>
    </div>
  </div>
</template>
