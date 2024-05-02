<script setup lang="ts">
import type { Tweet } from '@/types/queries'
import { MessageCircleMore } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import TimeAgo from 'javascript-time-ago'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import CommentDialog from '@/components/Post/CommentDialog.vue'
import PostAvatar from '@/components/UserAvatar.vue'
import LikeButton from '@/components/Post/LikeButton.vue'
import RetweetButton from '@/components/Post/RetweetButton.vue'
import PostDropdown from '@/components/Post/Dropdown/Dropdown.vue'
import { Repeat2 } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import Typographer from '@/components/Typographer.vue'
import PostImagesLayout from '@/components/Post/PostImagesLayout.vue'

const userStore = useUserStore()
const router = useRouter()
const timeAgo = new TimeAgo('zh-TW')
const props = defineProps<{ tweet: Tweet }>()

function goToPost() {
  if (document?.getSelection()?.type === 'Range') return
  router.push(`/post/${props.tweet.post.id}`)
}
</script>

<template>
  <div
    @click="goToPost"
    class="hover:bg-primary/10 duration-300 cursor-pointer px-4 pt-2 border-b-[1px]"
  >
    <div
      v-if="tweet.isRetweet && tweet.retweeter"
      class="flex gap-2 text-sm text-muted-foreground items-center pl-6"
    >
      <Repeat2 :size="18" />
      <RouterLink @click.stop :to="`/${tweet.retweeter.tag}`" class="hover:underline">
        {{ tweet.retweeter.name === userStore.user.name ? '你' : `${tweet.retweeter.name} ` }}已轉發
      </RouterLink>
    </div>
    <div class="flex gap-2">
      <div class="pt-1">
        <PostAvatar :avatar="tweet.author.avatar" :tag="tweet.author.tag" />
      </div>
      <div class="flex-1">
        <div class="flex justify-between">
          <div class="flex gap-1 flex-wrap">
            <RouterLink @click.stop :to="`/${tweet.author.tag}`" class="hover:underline font-bold">
              {{ tweet.author.name }}
            </RouterLink>
            <div class="flex text-muted-foreground">
              <div class="max-w-48 truncate sm:max-w-none">@{{ tweet.author.tag }}．</div>
              <time class="whitespace-nowrap"
                >{{ timeAgo.format(new Date(tweet.post.created_at), 'twitter-minute-now') }}
              </time>
            </div>
          </div>
          <PostDropdown
            :authorId="tweet.author.id"
            :author-tag="tweet.author.tag"
            :postId="tweet.post.id"
          />
        </div>
        <Typographer :content="tweet.post.content" />
        <PostImagesLayout :imageUrls="tweet.post.imageSrc" />
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
                {{ tweet.post.comments.length }}
              </DialogTrigger>
              <CommentDialog :post="props.tweet.post" :author="props.tweet.author" />
            </Dialog>
          </div>
          <div class="flex-1">
            <RetweetButton :post="tweet.post" />
          </div>

          <div class="flex-1">
            <LikeButton :post="tweet.post" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
