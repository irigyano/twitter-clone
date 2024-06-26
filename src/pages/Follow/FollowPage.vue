<script setup lang="ts">
import PageNav from '@/components/Layout/PageNav.vue'
import { getUserFollowByTag } from '@/utils/services'
import { useQuery } from '@tanstack/vue-query'
import { useHead } from '@unhead/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import FollowList from '@/pages/Follow/FollowList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
const route = useRoute()

const category = ref(route.name)

const { isLoading, data: user } = useQuery({
  queryKey: ['userRelation'],
  queryFn: () => getUserFollowByTag(route.params.user as string),
  gcTime: 0,
  retry: false
})

// computed when updateUrl calledd
const isFollowersCategory = computed(() => category.value === 'followers')
const isFollowingCategory = computed(() => category.value === 'following')

function updateUrl(path: string) {
  if (!user.value?.tag) return
  history.replaceState({}, '', `/${user.value.tag}/${path}`)
  category.value = path
}

useHead({
  title: () => {
    if (!user.value) return ''
    const name = user.value.name
    const tag = user.value.tag
    let title = ' / W'
    if (isFollowersCategory.value) {
      title = `正在跟隨 ${name} (@${tag}) 的人` + title
    } else if (isFollowingCategory.value) {
      title = `${name} (@${tag}) 跟隨的人` + title
    }
    return title
  }
})
</script>

<template>
  <div class="flex flex-col w-full">
    <PageNav :title="'跟隨'" />

    <div class="flex text-center border-b-[1px]">
      <div
        @click="updateUrl('followers')"
        class="flex-1 py-4 relative cursor-pointer hover:bg-secondary duration-300"
      >
        跟隨者
        <div
          v-if="isFollowersCategory"
          class="h-1 w-14 absolute bottom-0 rounded-full bg-primary left-1/2 -translate-x-1/2"
        ></div>
      </div>
      <div
        @click="updateUrl('following')"
        class="flex-1 py-4 relative cursor-pointer hover:bg-secondary duration-300"
      >
        正在跟隨
        <div
          v-if="isFollowingCategory"
          class="h-1 w-14 absolute bottom-0 rounded-full bg-primary left-1/2 -translate-x-1/2"
        ></div>
      </div>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <div v-else-if="user">
      <FollowList v-if="isFollowersCategory" :target-user-follows="user.follower" />
      <FollowList v-else-if="isFollowingCategory" :target-user-follows="user.following" />
    </div>
  </div>
</template>
