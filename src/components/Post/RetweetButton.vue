<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/stores/user'
import { Repeat2 } from 'lucide-vue-next'
import type { PostInfo } from '@/types/queries'
import { computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { insertRetweet, deleteRetweet } from '@/utils/actions'
const props = defineProps<{ post: PostInfo }>()
const userStore = useUserStore()
const queryClient = useQueryClient()

const isRetweeted = computed(() =>
  props.post.retweets.some((retweet) => retweet.user_id === userStore.user.id)
)
const retweets = computed(() => props.post.retweets.length)

async function retweet() {
  if (isRetweeted.value) {
    await deleteRetweet(userStore.user.id, props.post.id)
  } else if (!isRetweeted.value) {
    await insertRetweet(userStore.user.id, props.post.id)
  }
  // HomePage
  queryClient.invalidateQueries({ queryKey: ['tweets'] })
  // UserPage
  queryClient.invalidateQueries({ queryKey: ['UserTweets'] })
  // PostPage
  queryClient.invalidateQueries({ queryKey: [props.post.id] })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child @click.stop>
      <button
        class="flex hover:text-green-500 group gap-1 items-center duration-300"
        :class="isRetweeted && 'text-green-500'"
      >
        <div
          class="group-hover:bg-green-500 group-hover:text-green-500 group-hover:bg-opacity-30 rounded-full p-2 cursor-pointer duration-300"
        >
          <Repeat2 :size="18" />
        </div>
        {{ retweets }}
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-0">
      <DropdownMenuItem @click.stop="retweet" class="cursor-pointer flex gap-2 text-base">
        <Repeat2 />
        <span>{{ isRetweeted ? '取消轉發' : '轉發' }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
