<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import { Heart } from 'lucide-vue-next'
import { ref } from 'vue'

const {
  isLiked: isLikedProps,
  likesCount,
  postId
} = defineProps<{ isLiked: boolean; likesCount: number; postId: string }>()

const userStore = useUserStore()
const isLiked = ref(isLikedProps)
const likes = ref(likesCount)

async function likePost() {
  if (isLiked.value) {
    supabase.from('likes').delete().eq('postId', postId).eq('userId', userStore.user.id).then()
    likes.value--
  } else {
    supabase.from('likes').insert({ userId: userStore.user.id, postId: postId }).then()
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
