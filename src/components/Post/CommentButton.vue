<script setup lang="ts">
import type { Tweet } from '@/types/queries'
import { MessageCircleMore } from 'lucide-vue-next'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import CommentDialog from '@/components/Post/CommentDialog.vue'
defineProps<{ tweet: Tweet }>()
</script>

<template>
  <Dialog>
    <DialogTrigger
      @click.stop
      class="flex gap-1 items-center group hover:text-blue-400 duration-300"
    >
      <div
        class="group-hover:bg-blue-400 group-hover:text-blue-400 group-hover:bg-opacity-30 rounded-full p-2 cursor-pointer duration-300"
      >
        <MessageCircleMore :size="18" />
      </div>
      {{ tweet.post.comments.length }}
    </DialogTrigger>
    <CommentDialog :post="tweet.post" :author="tweet.author" />
  </Dialog>
</template>
