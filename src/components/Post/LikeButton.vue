<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { Heart } from 'lucide-vue-next'
import { ref } from 'vue'
import type { Post } from '@/utils/query'

const { post } = defineProps<{ post: Post['post'] }>()

const userStore = useUserStore()
const isLiked = ref(post.likes.some((like) => like.userId === userStore.user.id))
const likes = ref(post.likes.length)

async function likePost() {
  if (isLiked.value) {
    supabase.from('likes').delete().eq('postId', post.id).eq('userId', userStore.user.id).then()
    likes.value--
  } else {
    supabase.from('likes').insert({ userId: userStore.user.id, postId: post.id }).then()
    likes.value++
  }
  isLiked.value = !isLiked.value
}
</script>

<template>
  <button
    @click.stop="likePost"
    class="flex hover:text-red-500 group gap-1 items-center duration-300"
    :class="isLiked && 'text-red-500'"
  >
    <div
      class="group-hover:bg-red-500 group-hover:text-red-500 group-hover:bg-opacity-30 rounded-full p-2 cursor-pointer duration-300"
    >
      <Heart :class="isLiked && 'fill-red-500'" :size="18" />
    </div>
    {{ likes }}
  </button>
</template>
