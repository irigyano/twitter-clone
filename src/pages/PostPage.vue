<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { getPostById } from '@/utils/query'
import Loading from '@/components/Loading.vue'
import { computed, ref } from 'vue'
import PostAvatar from '@/components/PostAvatar.vue'
import { useUserStore } from '@/stores/user'
import ResponsiveRowTextarea from '@/components/Post/ResponsiveRowTextarea.vue'
import Comment from '@/components/Post/Comment.vue'
import { MessageCircleMore } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase'
import PageNav from '@/components/Layout/PageNav.vue'
import LikeButton from '@/components/Post/LikeButton.vue'
import FollowButton from '@/components/FollowButton.vue'
import { useHead } from '@unhead/vue'

const router = useRouter()
const queryClient = useQueryClient()
const route = useRoute()
const userStore = useUserStore()
const timeOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
}
const commentContent = ref()

async function addComment() {
  const { error } = await supabase.from('comments').insert({
    comment: commentContent.value.trim(),
    postId: route.params.postId as string,
    userId: userStore.user.id
  })
  if (error) throw new Error(error.message)
}

const { isLoading, data: post } = useQuery({
  queryKey: [route.params.postId],
  queryFn: async () => {
    const data = await getPostById(route.params.postId as string)
    return data
  },
  gcTime: 0
})

useHead({
  title: () => {
    if (!post.value) return ''
    const data = post.value
    return `W 上的 ${data.user!.name}：「${data.content || data.imageSrc}」 / W`
  }
})

const { mutate } = useMutation({
  mutationFn: addComment,
  onSuccess: () => {
    commentContent.value = ''
    queryClient.invalidateQueries({ queryKey: [route.params.postId] })
  }
})

const user = computed(() => {
  if (post.value?.user) return post.value.user
})
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
  >
    <Loading />
  </div>
  <div class="flex flex-col w-full">
    <PageNav title="貼文" />
    <div v-if="post && user">
      <!-- post body -->
      <div class="p-4">
        <div class="flex gap-2">
          <PostAvatar :avatar="user.avatar" :tag="user.tag" />
          <div class="pb-2 flex-1">
            <div
              @click.stop="router.push(`/${user!.tag}`)"
              class="font-bold inline-block cursor-pointer hover:underline"
            >
              {{ user.name }}
            </div>
            <div class="text-muted-foreground">@{{ user.tag }}</div>
          </div>
          <FollowButton :targetUserId="user.id" :follower="user.follower" />
        </div>

        <div class="whitespace-pre-wrap break-all">
          {{ post.content }}
        </div>
        <img
          class="rounded-3xl w-full border-[1px] border-border mt-3"
          v-if="post.imageSrc"
          :src="post.imageSrc"
        />
        <div class="py-2 text-muted-foreground text-sm">
          <time class="whitespace-nowrap"
            >{{ new Date(post.created_at).toLocaleString('zh-tw', timeOptions) }}
          </time>
        </div>
        <!-- status -->
        <div class="border-y-[1px] flex py-1 text-muted-foreground">
          <div class="flex gap-1 items-center flex-1">
            <div class="p-2">
              <MessageCircleMore :size="18" />
            </div>
            {{ post.comments.length }}
          </div>
          <div class="flex-1">
            <LikeButton :post="post" />
          </div>
        </div>
      </div>

      <!-- reply -->
      <div class="flex border-b-[1px] px-4">
        <PostAvatar :avatar="userStore.user.avatar" :tag="user.tag" />
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
      <div>
        <Comment v-for="{ user, ...comment } in post.comments" :user="user" :comment="comment" />
      </div>
    </div>
  </div>
</template>
