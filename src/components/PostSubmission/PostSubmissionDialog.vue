<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import PostSubmission from '@/components/PostSubmission/PostSubmission.vue'
import { PencilLine } from 'lucide-vue-next'
import { ref } from 'vue'
const showDialog = ref(false)
</script>

<template>
  <Dialog v-model:open="showDialog">
    <DialogTrigger
      @click="showDialog = true"
      class="bg-primary w-10 xl:w-full h-10 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-primary/80 duration-300"
    >
      <div class="hidden xl:block">發佈</div>
      <PencilLine class="xl:hidden" :size="20" />
    </DialogTrigger>
    <DialogContent class="p-0">
      <PostSubmission v-model="showDialog" />
    </DialogContent>
  </Dialog>
</template>
