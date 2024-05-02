<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-vue-next'
import DeletePost from '@/components/Post/Dropdown/DeletePost.vue'
import Follow from '@/components/Post/Dropdown/Follow.vue'
defineProps<{ authorId: string; postId: string }>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <div @click.stop class="hover:bg-primary/50 rounded-full duration-300 h-fit">
        <Ellipsis class="p-1" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DeletePost :author-id="authorId" :post-id="postId" />
      <Follow :author-id="authorId" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
