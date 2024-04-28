<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { Repeat2 } from 'lucide-vue-next'
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
  queryClient.invalidateQueries({ queryKey: ['userTweets'] })
  queryClient.invalidateQueries({ queryKey: [props.post.id] })
}
</script>

<template>
  <button
    @click.stop="retweet"
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
</template>
