<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/shadcn'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
defineProps<{
  imageUrl: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Dialog>
    <DialogTrigger :class="cn('block min-w-0 min-h-0', $props.class)" @click.stop>
      <img class="h-full w-full object-cover min-h-[100px] max-h-[500px]" :src="imageUrl" />
    </DialogTrigger>
    <DialogContent class="max-w-full h-full flex items-center justify-center">
      <div class="h-fit max-h-full">
        <img class="min-h-[100px] max-h-full" :src="imageUrl" />
      </div>
      <!-- <div class="hidden lg:block max-w-[300px] flex-1 border-l-[1px]">Post Metas</div> -->
    </DialogContent>
  </Dialog>
</template>
