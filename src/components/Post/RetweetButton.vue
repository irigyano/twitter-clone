<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { Repeat2, PencilLine } from 'lucide-vue-next'
import type { PostInfo } from '@/types/queries'
import { computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
const props = defineProps<{ post: PostInfo }>()
const userStore = useUserStore()
const queryClient = useQueryClient()

const isRetweeted = computed(() =>
  props.post.retweets.some((retweet) => retweet.user_id === userStore.user.id)
)
const retweets = computed(() => props.post.retweets.length)

async function retweet() {
  if (isRetweeted.value) {
    await supabase
      .from('retweets')
      .delete()
      .eq('post_id', props.post.id)
      .eq('user_id', userStore.user.id)
  } else if (!isRetweeted.value) {
    await supabase
      .from('retweets')
      .insert({ user_id: userStore.user.id, post_id: props.post.id })
      .then()
  }
  queryClient.invalidateQueries({ queryKey: ['tweets'] })
  queryClient.invalidateQueries({ queryKey: [userStore.user.tag + 'UserTweets'] })
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
        <span v-if="!isRetweeted">轉發</span>
        <span v-else-if="isRetweeted">取消轉發</span>
      </DropdownMenuItem>
      <DropdownMenuItem disabled class="flex gap-2 text-base">
        <PencilLine />
        <span>引用</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
