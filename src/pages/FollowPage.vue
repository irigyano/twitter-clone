<script setup lang="ts">
import PageNav from '@/components/Layout/PageNav.vue'
import { useUserStore } from '@/stores/user'
import { getUserFollowByTag } from '@/utils/services'
import { useQuery } from '@tanstack/vue-query'
import { useHead } from '@unhead/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '@/components/Loading.vue'
import FollowList from '@/components/FollowList.vue'
const route = useRoute()
const userStore = useUserStore()

const category = ref(route.name)

const isFollowersCategory = computed(() => category.value === 'followers')
const isFollowingCategory = computed(() => category.value === 'following')

const { isLoading, data: user } = useQuery({
  queryKey: ['userRelation'],
  queryFn: () => getUserFollowByTag(route.params.user as string),
  gcTime: 0,
  retry: false
})

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

function addHashToLocation(path: string) {
  history.replaceState({}, '', `/${userStore.user.tag}/${path}`)
  category.value = path
}
</script>

<template>
  <div class="flex flex-col w-full">
    <PageNav :title="'跟隨'" />

    <div class="flex text-center border-b-[1px]">
      <div
        @click="addHashToLocation('followers')"
        class="flex-1 py-4 relative cursor-pointer hover:bg-secondary duration-300"
      >
        跟隨者
        <div
          v-if="isFollowersCategory"
          class="h-1 w-14 absolute bottom-0 rounded-full bg-primary left-1/2 -translate-x-1/2"
        ></div>
      </div>
      <div
        @click="addHashToLocation('following')"
        class="flex-1 py-4 relative cursor-pointer hover:bg-secondary duration-300"
      >
        正在跟隨
        <div
          v-if="isFollowingCategory"
          class="h-1 w-14 absolute bottom-0 rounded-full bg-primary left-1/2 -translate-x-1/2"
        ></div>
      </div>
    </div>

    <!-- DRY? -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <Loading />
    </div>

    <div v-else-if="user">
      <FollowList v-if="isFollowersCategory" :target-user-follows="user.follower" />
      <FollowList v-else-if="isFollowingCategory" :target-user-follows="user.following" />
    </div>
  </div>
</template>
