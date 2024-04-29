<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { insertComment } from '@/utils/actions'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { getCommentsByPostId } from '@/utils/services'
import ResponsiveRowTextarea from '@/components/Post/ResponsiveRowTextarea.vue'
import PostAvatar from '@/components/PostAvatar.vue'
import Comment from '@/components/Post/Comment.vue'
const route = useRoute()
const queryClient = useQueryClient()
const userStore = useUserStore()

const commentContent = ref()

const { isLoading, data: comments } = useQuery({
  queryKey: [route.params.postId + 'Comment'],
  queryFn: () => getCommentsByPostId(route.params.postId as string),
  gcTime: 0,
  retry: 0
})

const { mutate } = useMutation({
  mutationFn: () =>
    insertComment(userStore.user.id, route.params.postId as string, commentContent.value),
  onSuccess: () => {
    commentContent.value = ''
    queryClient.invalidateQueries({ queryKey: [route.params.postId + 'Comment'] })
  }
})
</script>

<template>
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

  <div>
    <Comment
      v-for="{ user, ...comment } in comments"
      :user="user"
      :comment="comment"
      :key="comment.id"
    />
  </div>
</template>
