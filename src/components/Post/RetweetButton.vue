<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { Repeat2 } from 'lucide-vue-next'
import type { Post } from '@/utils/query'
const { post } = defineProps<{ post: Post['post'] }>()
const userStore = useUserStore()

async function retweet() {
  const { error } = await supabase
    .from('retweets')
    .insert({ user_id: userStore.user.id, post_id: post.id })
}
</script>

<template>
  <button
    @click.stop="retweet"
    class="flex hover:text-green-500 group gap-1 items-center duration-300"
  >
    <div
      class="group-hover:bg-green-500 group-hover:text-green-500 group-hover:bg-opacity-30 rounded-full p-2 cursor-pointer duration-300"
    >
      <Repeat2 :size="18" />
    </div>
    {{ 0 }}
  </button>
</template>
