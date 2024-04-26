<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Comment } from '@/utils/query'
import { useUserStore } from '@/stores/user'
import { Trash2 } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import TimeAgo from 'javascript-time-ago'
import PostAvatar from '@/components/PostAvatar.vue'

const timeAgo = new TimeAgo('zh-TW')
const userStore = useUserStore()
const queryClient = useQueryClient()
const router = useRouter()
const route = useRoute()

type CommentOmitUser = Omit<Comment, 'user'>
const { comment, user } = defineProps<{ comment: CommentOmitUser; user: Comment['user'] }>()

async function deleteComment() {
  const { error } = await supabase.from('comments').delete().eq('id', comment.id)
  if (error) throw new Error(error.message)
}

const { mutate } = useMutation({
  mutationFn: deleteComment,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [route.params.postId] })
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
