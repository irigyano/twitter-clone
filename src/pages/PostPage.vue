<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { getPostById } from '@/utils/services'
import Loading from '@/components/Loading.vue'
import { ref, watch } from 'vue'
import PostAvatar from '@/components/PostAvatar.vue'
import { useUserStore } from '@/stores/user'
import ResponsiveRowTextarea from '@/components/Post/ResponsiveRowTextarea.vue'
// import Comment from '@/components/Post/Comment.vue'
import { MessageCircleMore } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import PageNav from '@/components/Layout/PageNav.vue'
import LikeButton from '@/components/Post/LikeButton.vue'
import FollowButton from '@/components/FollowButton.vue'
import { useHead } from '@unhead/vue'
import RetweetButton from '@/components/Post/RetweetButton.vue'
import PostImagesLayout from '@/components/Post/PostImagesLayout.vue'
import Typographer from '@/components/Typographer.vue'
import { insertComment } from '@/utils/actions'
import { timeOptions } from '@/utils/config'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const queryClient = useQueryClient()

const commentContent = ref()

const {
  isLoading,
  data: post,
  isError
} = useQuery({
  queryKey: [route.params.postId],
  queryFn: () => getPostById(route.params.postId as string),
  gcTime: 0,
  retry: 0
})

const { mutate } = useMutation({
  mutationFn: () =>
    insertComment(userStore.user.id, route.params.postId as string, commentContent.value),
  onSuccess: () => {
    commentContent.value = ''
    queryClient.invalidateQueries({ queryKey: [route.params.postId] })
  }
})

watch(isError, () => {
  // Redirect to home page if post not found
  router.push({ name: 'home' })
})

useHead({
  title: () => {
    if (!post.value) return ''
    const data = post.value
    return `W 上的 ${data.user.name}：「${data.content || data.imageSrc}」 / W`
  }
})
</script>

<template>
  <div class="flex flex-col w-full">
    <PageNav title="貼文" />
    <div v-if="isLoading" class="w-full h-full flex justify-center items-center">
      <Loading />
    </div>
    <div v-else-if="post">
      <!-- post body -->
      <div class="px-4 pt-4">
        <div class="flex gap-2">
          <PostAvatar :avatar="post.user.avatar" :tag="post.user.tag" />
          <div class="pb-2 flex-1">
            <div
              @click.stop="router.push(`/${post.user.tag}`)"
              class="font-bold inline-block cursor-pointer hover:underline"
            >
              {{ post.user.name }}
            </div>
            <div class="text-muted-foreground">@{{ post.user.tag }}</div>
          </div>
          <FollowButton :targetUserId="post.user.id" :followers="post.user.follower" />
        </div>
        <Typographer :content="post.content" />
        <PostImagesLayout :imageUrls="post.imageSrc" />
        <div class="py-2 text-muted-foreground text-sm">
          <time class="whitespace-nowrap"
            >{{ new Date(post.created_at).toLocaleString('zh-tw', timeOptions) }}
          </time>
        </div>
      </div>

      <!-- status -->
      <div class="border-y-[1px] flex py-1 text-muted-foreground justify-around">
        <div class="flex gap-1 items-center">
          <div class="p-2">
            <MessageCircleMore :size="18" />
          </div>
          {{ post.comments.length }}
        </div>
        <RetweetButton :post="post" />
        <LikeButton :post="post" />
      </div>

      <!-- reply -->
      <div class="flex border-b-[1px] px-4 pt-4">
        <PostAvatar :avatar="userStore.user.avatar" :tag="userStore.user.tag" />
        <div class="flex-1 flex flex-col">
          <div class="pt-1">
            <ResponsiveRowTextarea v-model="commentContent" />
          </div>
          <div class="self-end p-2">
            <Button @click="mutate" :disabled="!commentContent || commentContent.trim().length <= 0"
              >回覆</Button
            >
          </div>
        </div>
      </div>
      <!-- <div>
        <Comment
          v-for="{ user, ...comment } in post.comments"
          :user="user!"
          :comment="comment"
          :key="comment.id"
        />
      </div> -->
    </div>
  </div>
</template>
