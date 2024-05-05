<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { User, Comment } from '@/types/queries'
import { useUserStore } from '@/stores/user'
import { Trash2 } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import TimeAgo from 'javascript-time-ago'
import PostAvatar from '@/components/UserAvatar.vue'
import { deleteCommentById } from '@/utils/actions'
const timeAgo = new TimeAgo('zh-TW')
const userStore = useUserStore()
const queryClient = useQueryClient()
const router = useRouter()
const route = useRoute()

const { comment, user } = defineProps<{ comment: Comment; user: User }>()

const { mutate } = useMutation({
  mutationFn: () => deleteCommentById(comment.id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [route.params.postId + 'Comment'] })
  }
})
</script>

<template>
  <div v-if="comment && user" class="flex gap-2 px-4 py-2 border-b-[1px] border-border">
    <div class="pt-1">
      <PostAvatar :avatar="user.avatar" :tag="user.tag" />
    </div>
    <div class="flex-1">
      <div class="flex justify-between items-center">
        <div class="flex gap-1 flex-wrap">
          <div
            class="hover:underline font-bold cursor-pointer"
            @click.stop="router.push(`/${user!.tag}`)"
          >
            {{ user.name }}
          </div>
          <div class="flex text-muted-foreground">
            <div class="max-w-48 truncate sm:max-w-none">@{{ user.tag }}．</div>
            <time class="whitespace-nowrap"
              >{{ timeAgo.format(new Date(comment.created_at), 'twitter-minute-now') }}
            </time>
          </div>
        </div>
        <button
          class="text-muted-foreground hover:bg-blue-400 hover:bg-opacity-30 hover:text-blue-400 duration-300 rounded-full p-1"
          v-if="user.id === userStore.user.id"
          @click="mutate()"
        >
          <Trash2 :size="18" />
        </button>
      </div>
      <div class="whitespace-pre-wrap break-all py-1">{{ comment.comment }}</div>
    </div>
  </div>
</template>
