<script setup lang="ts">
import type { Post } from '@/utils/query'
import { useUserStore } from '@/stores/user'
import { MessageCircleMore } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import TimeAgo from 'javascript-time-ago'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import CommentDialog from '@/components/CommentDialog.vue'
import PostAvatar from '@/components/PostAvatar.vue'
import LikeButton from '@/components/LikeButton.vue'
import PostOptionsDropdown from '@/components/PostOptionsDropdown.vue'

const timeAgo = new TimeAgo('zh-TW')
const userStore = useUserStore()
const router = useRouter()

const props = defineProps<{ post: Post['post']; author: Post['author'] }>()

const isLiked = props.post.likes.some((like) => like.userId === userStore.user.id)

function goToPost() {
  if (document?.getSelection()?.type === 'Range') return
  router.push(`/post/${props.post.id}`)
}
</script>

<template>
  <div
    @click="goToPost"
    class="flex gap-2 px-4 pt-2 border-b-[1px] border-border hover:bg-primary/10 duration-300 cursor-pointer"
  >
    <div class="pt-1">
      <PostAvatar :avatar="author.avatar" :tag="author.tag" />
    </div>
    <div class="flex-1">
      <div class="flex justify-between">
        <div class="flex gap-1 flex-wrap">
          <div class="hover:underline font-bold" @click.stop="router.push(`/${author.tag}`)">
            {{ author.name }}
          </div>
          <div class="flex text-muted-foreground">
            <div class="max-w-48 truncate sm:max-w-none">@{{ author.tag }}．</div>
            <time class="whitespace-nowrap"
              >{{ timeAgo.format(new Date(post.created_at), 'twitter-minute-now') }}
            </time>
          </div>
        </div>
        <PostOptionsDropdown :authorId="author.id" :postId="post.id" />
      </div>
      <div class="whitespace-pre-wrap break-all">{{ post.content }}</div>
      <img
        class="rounded-3xl w-full border-[1px] border-border mt-3"
        v-if="post.imageSrc"
        :src="post.imageSrc"
      />
      <div class="flex justify-evenly gap-1 p-1 text-muted-foreground">
        <div class="flex-1">
          <Dialog>
            <DialogTrigger
              @click.stop
              class="flex gap-1 items-center group hover:text-blue-400 duration-300"
            >
              <div
                class="group-hover:bg-blue-400 group-hover:text-blue-400 group-hover:bg-opacity-30 rounded-full p-2 cursor-pointer duration-300"
              >
                <MessageCircleMore :size="18" />
              </div>
              {{ post.comments.length }}
            </DialogTrigger>
            <DialogContent>
              <CommentDialog :post="props.post" :author="props.author" />
            </DialogContent>
          </Dialog>
        </div>
        <div class="flex-1">
          <LikeButton :isLiked="isLiked" :likesCount="props.post.likes.length" :postId="post.id" />
        </div>
      </div>
    </div>
  </div>
</template>
