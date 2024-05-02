<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getPostById } from '@/utils/services'
import Loading from '@/components/Loading.vue'
import { watch } from 'vue'
import PostAvatar from '@/components/PostAvatar.vue'
import { MessageCircleMore } from 'lucide-vue-next'
import PageNav from '@/components/Layout/PageNav.vue'
import LikeButton from '@/components/Post/LikeButton.vue'
import { useHead } from '@unhead/vue'
import RetweetButton from '@/components/Post/RetweetButton.vue'
import PostImagesLayout from '@/components/Post/PostImagesLayout.vue'
import Typographer from '@/components/Typographer.vue'
import { timeOptions } from '@/utils/config'
import PostPageCommentSection from '@/components/Post/PostPageCommentSection.vue'
import PostOptionsDropdown from '@/components/Post/Dropdown/Dropdown.vue'
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
    <div v-if="isLoading" class="w-full h-full flex justify-center items-center">
      <Loading />
    </div>
    <div v-else-if="post">
      <!-- post body -->
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
            <PostOptionsDropdown :authorId="post.user.id" :postId="post.id" />
          </div>
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

      <PostPageCommentSection />
    </div>
  </div>
</template>
