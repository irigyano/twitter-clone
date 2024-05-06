<script setup lang="ts">
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Trash2 } from 'lucide-vue-next'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useUserStore } from '@/stores/user'
import { deletePostById } from '@/utils/actions'
import { useRoute, useRouter } from 'vue-router'
const queryClient = useQueryClient()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { postId } = defineProps<{ authorId: string; postId: string }>()
const { mutate } = useMutation({
  mutationFn: () => deletePostById(postId),
  onSuccess: () => {
    if (route.name === 'post') router.push({ name: 'home' })
    queryClient.invalidateQueries({ queryKey: ['tweets'] })
    queryClient.invalidateQueries({ queryKey: ['UserTweets'] })
    queryClient.invalidateQueries({ queryKey: ['SearchTweets'] })
  }
})
</script>

<template>
  <DropdownMenuItem
    @click.stop="mutate()"
    v-if="authorId === userStore.user.id"
    class="text-red-500 cursor-pointer"
  >
    <Trash2 class="mr-2 h-4 w-4" />
    <span>刪除</span>
  </DropdownMenuItem>
</template>
