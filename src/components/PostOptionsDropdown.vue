<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Ellipsis, MessageSquareOff, Trash2 } from 'lucide-vue-next'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'

const queryClient = useQueryClient()
const userStore = useUserStore()

const { authorId, postId } = defineProps<{ authorId: string; postId: string }>()

async function deletePost() {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw new Error(error.message)
}

const { mutate } = useMutation({
  mutationFn: deletePost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    queryClient.invalidateQueries({ queryKey: ['userPosts'] })
  }
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <div @click.stop class="hover:bg-primary/50 rounded-full duration-300 h-fit">
        <Ellipsis class="p-1" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        @click.stop="mutate()"
        v-if="authorId === userStore.user.id"
        class="text-red-500 cursor-pointer"
      >
        <Trash2 class="mr-2 h-4 w-4" />
        <span>刪除</span>
      </DropdownMenuItem>

      <DropdownMenuItem disabled>
        <MessageSquareOff class="mr-2 h-4 w-4" />
        <span>將此對話靜音</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
