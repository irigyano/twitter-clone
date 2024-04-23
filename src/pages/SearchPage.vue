<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from 'unhead'
import PageNav from '@/components/PageNav.vue'
import { getPostsByTextSearch } from '@/utils/query'
import { useQuery } from '@tanstack/vue-query'
import Loading from '@/components/Loading.vue'
import Post from '@/components/Post.vue'
const route = useRoute()

const { isLoading, data: posts } = useQuery({
  queryKey: [route.query.q],
  queryFn: () => getPostsByTextSearch(route.query.q as string),
  retry: false
})

useHead({
  title: `${route.query.q} - 搜尋 / Webber`
})
</script>

<template>
  <div class="flex flex-col w-full">
    <PageNav :title="`搜尋`" />

    <div v-if="posts?.length" class="border-t-[1px]">
      <Post :post="post" :author="post.user!" v-for="post in posts" />
    </div>

    <div v-else class="flex-1 flex items-center justify-center">
      <Loading v-if="isLoading" />
      <div v-else class="text-2xl font-bold">找不到 {{ route.query.q }} 的結果。</div>
    </div>
  </div>
</template>
