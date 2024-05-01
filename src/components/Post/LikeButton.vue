<script setup lang="ts">
import type { PostInfo } from '@/types/queries'
import { useUserStore } from '@/stores/user'
import { Heart } from 'lucide-vue-next'
import { ref } from 'vue'
import { insertLike, deleteLike } from '@/utils/actions'
const userStore = useUserStore()
const { post } = defineProps<{ post: PostInfo }>()

const isLiked = ref(post.likes.some((like) => like.userId === userStore.user.id))
const likes = ref(post.likes.length)

function likePost() {
  if (isLiked.value) {
    deleteLike(userStore.user.id, post.id)
    likes.value--
  } else {
    insertLike(userStore.user.id, post.id)
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
