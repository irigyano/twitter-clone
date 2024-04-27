<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { Repeat2 } from 'lucide-vue-next'
import type { PostInfo } from '@/types/queries'
import { ref } from 'vue'
const { post } = defineProps<{ post: PostInfo }>()
const userStore = useUserStore()

const isRetweeted = ref(post.retweets.some((retweet) => retweet.user_id === userStore.user.id))
const retweets = ref(post.retweets.length)

// Revisit: is Optimistic updates problematic
function retweet() {
  if (isRetweeted.value) {
    supabase
      .from('retweets')
      .delete()
      .eq('post_id', post.id)
      .eq('user_id', userStore.user.id)
      .then()
    retweets.value--
  } else if (!isRetweeted.value) {
    supabase.from('retweets').insert({ user_id: userStore.user.id, post_id: post.id }).then()
    retweets.value++
  }
  return (isRetweeted.value = !isRetweeted.value)
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
