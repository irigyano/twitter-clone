<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Post } from '@/utils/query'
import { useUserStore } from '@/stores/user'
import { Heart, Trash2, MessageCircleMore } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const userStore = useUserStore()
const queryClient = useQueryClient()

const props = defineProps<{ post: Post['post']; author: Post['author'] }>()

const likes = ref(props.post.likes.length)
const isLiked = ref<boolean>(props.post.likes.some((like) => like.userId === userStore.user.id))

async function deletePost() {
  const { error } = await supabase.from('posts').delete().eq('id', props.post.id)
  if (error) return Promise.reject()
}

async function likePost() {
  // TODO: better optimistic update
  if (isLiked.value) {
    supabase
      .from('likes')
      .delete()
      .eq('postId', props.post.id)
      .eq('userId', userStore.user.id)
      .then()
    likes.value--
  } else {
    supabase.from('likes').insert({ userId: userStore.user.id, postId: props.post.id }).then()
    likes.value++
  }
  isLiked.value = !isLiked.value
}

const { mutate } = useMutation({
  mutationFn: deletePost,
  onSuccess: () => {
    // TODO: optimazation
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    queryClient.invalidateQueries({ queryKey: ['userPosts'] })
  },
  onError: () => {
    // pop up
    console.log('failed')
  }
})
</script>

<template>
  <div class="flex gap-2 px-4 pt-2 border-b-[1px] border-gray-700">
    <img
      alt="avatar"
      class="min-w-10 h-10 rounded-full object-cover"
      width="40"
      height="40"
      :src="author!.avatar || ''"
    />
    <div class="flex-1">
      <div class="flex justify-between">
        <div class="flex gap-2">
          <RouterLink :to="`/${author.tag}`"> {{ author.name }} @{{ author.tag }} </RouterLink>
          <p class="text-muted-foreground">
            {{ new Date(post.created_at).toLocaleTimeString() }}
          </p>
        </div>
        <button
          class="text-muted-foreground hover:bg-blue-400 hover:bg-opacity-30 hover:text-blue-400 p-2 duration-300 rounded-full"
          v-if="author.id === userStore.user.id"
          @click="mutate()"
        >
          <Trash2 :size="18" />
        </button>
      </div>
      <pre class="text-wrap break-all">{{ post.content }}</pre>
      <img class="rounded-3xl w-full pt-2" v-if="post.imageSrc" :src="post.imageSrc" />
      <div class="flex justify-evenly gap-1 p-1 text-muted-foreground">
        <div class="flex-1">
          <button class="flex hover:text-blue-400 group gap-1 items-center duration-300">
            <div
              class="group-hover:bg-blue-400 group-hover:text-blue-400 group-hover:bg-opacity-30 rounded-full p-2 cursor-pointer duration-300"
            >
              <MessageCircleMore :size="18" />
            </div>
            {{ post.comments.length }}
          </button>
        </div>
        <div class="flex-1">
          <button
            @click="likePost()"
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
        </div>
      </div>
    </div>
  </div>
</template>
