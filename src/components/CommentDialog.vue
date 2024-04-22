<script setup lang="ts">
import type { Post } from '@/utils/query'
import { DialogFooter, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import { defaultAvatar } from '@/utils/defaultAvatar'
import { RouterLink } from 'vue-router'
import { Image } from 'lucide-vue-next'
import { supabase } from '@/utils/supabase'
import { useQueryClient } from '@tanstack/vue-query'
const queryClient = useQueryClient()

const comment = ref('')
const postContent = ref<HTMLDivElement>()
const userStore = useUserStore()
const { post, author } = defineProps<{ post: Post['post']; author: Post['author'] }>()

const lineHeight = 24
function calculateRowsHeight() {
  // fix to make it dynamic
  if (!postContent.value?.clientHeight) return false
  return postContent.value.clientHeight / lineHeight > 8
}
const showMore = computed(calculateRowsHeight)

async function sumbitComment() {
  const { error } = await supabase
    .from('comments')
    .insert({ comment: comment.value, postId: post.id, userId: userStore.user.id })
  if (error) throw new Error(error.message)
  queryClient.invalidateQueries({ queryKey: ['posts'] })
}
</script>

<template>
  <DialogTitle></DialogTitle>
  <div class="flex gap-2">
    <img
      class="rounded-full h-14 w-14 object-cover border-[1px] border-border"
      :src="author.avatar || defaultAvatar"
    />
    <div class="flex-1 flex flex-col gap-1">
      <div>
        {{ author.name }}
      </div>
      <div v-if="post.imageSrc" class="text-sm text-muted-foreground">
        <Image :size="20" />
      </div>
      <div :class="`whitespace-pre-wrap text-ellipsis overflow-hidden max-h-48 break-all`">
        <div ref="postContent">{{ post.content }}</div>
      </div>
      <RouterLink
        v-if="postContent && showMore"
        :to="`/post/${post.id}`"
        class="text-primary hover:text-primary/75 duration-300"
        >顯示更多</RouterLink
      >
    </div>
  </div>
  <div class="flex gap-2">
    <img
      :src="userStore.user.avatar"
      class="rounded-full h-14 w-14 object-cover border-[1px] border-border"
    />
    <textarea
      v-model="comment"
      placeholder="發佈你的回覆"
      class="flex-1 bg-transparent focus:outline-none h-32"
    ></textarea>
  </div>
  <DialogFooter>
    <DialogClose as-child>
      <Button @click="sumbitComment" :disabled="!comment">回覆</Button>
    </DialogClose>
  </DialogFooter>
</template>
