<script setup lang="ts">
import type { User, PostInfo } from '@/types/queries'
import { DialogContent, DialogFooter, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Image } from 'lucide-vue-next'
import { useQueryClient } from '@tanstack/vue-query'
import { insertComment } from '@/utils/actions'
import PostAvatar from '@/components/UserAvatar.vue'
const queryClient = useQueryClient()
const userStore = useUserStore()
const { post, author } = defineProps<{ post: PostInfo; author: User }>()

const comment = ref('')
const postContent = ref<HTMLDivElement>()

const lineHeight = 24
function calculateRowsHeight() {
  if (!postContent.value?.clientHeight) return false
  return postContent.value.clientHeight / lineHeight > 8
}
const showMore = computed(calculateRowsHeight)

async function sumbitComment() {
  await insertComment(userStore.user.id, post.id, comment.value)
  // NOTE: 1. Could remove this to reduce backend load or make it optimistic since comments count is not crucial
  //       2. Could make a popup that navigate to post for UX
  queryClient.invalidateQueries({ queryKey: ['tweets'] })
}
</script>

<template>
  <DialogContent>
    <div class="flex gap-2">
      <PostAvatar :avatar="author.avatar" :tag="author.tag" class="h-14 w-14" />
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
      <PostAvatar :avatar="userStore.user.avatar" :tag="userStore.user.tag" class="h-14 w-14" />
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
  </DialogContent>
</template>
