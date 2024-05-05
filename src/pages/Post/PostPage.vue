<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getPostById } from '@/utils/services'
import { watch } from 'vue'
import PostAvatar from '@/components/UserAvatar.vue'
import { MessageCircleMore } from 'lucide-vue-next'
import PageNav from '@/components/Layout/PageNav.vue'
import LikeButton from '@/components/Post/LikeButton.vue'
import { useHead } from '@unhead/vue'
import RetweetButton from '@/components/Post/RetweetButton.vue'
import PostImagesLayout from '@/components/Post/PostImagesLayout.vue'
import Typographer from '@/components/Typographer.vue'
import { timeOptions } from '@/utils/config'
import PostPageCommentSection from '@/pages/Post/PostPageCommentSection.vue'
import PostDropdown from '@/components/Post/Dropdown/Dropdown.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
const router = useRouter()
const route = useRoute()

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

    <LoadingSpinner v-if="isLoading" />

    <div v-else-if="post">
      <div class="px-4 pt-4">
        <div class="flex gap-2">
          <PostAvatar :avatar="post.user.avatar" :tag="post.user.tag" />
          <div class="pb-2 flex-1 flex justify-between">
            <div>
              <RouterLink
                @click.stop
                :to="`/${post.user.tag}`"
                class="font-bold inline-block cursor-pointer hover:underline"
              >
                {{ post.user.name }}
              </RouterLink>
              <div class="text-muted-foreground">@{{ post.user.tag }}</div>
            </div>
            <PostDropdown :authorId="post.user.id" :author-tag="post.user.tag" :postId="post.id" />
          </div>
        </div>
        <Typographer :content="post.content" media />
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

      <PostPageCommentSection />
    </div>
  </div>
</template>
