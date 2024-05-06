<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/utils/shadcn'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'
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
    <DialogContent class="max-w-full p-0 bg-transparent">
      <div class="flex h-[100dvh]">
        <!-- Left -->
        <div class="flex-1 flex flex-col w-0">
          <DialogClose as-child>
            <!-- Img: Why tf is this h-0 needed..... -->
            <div class="flex-1 h-0 flex justify-center">
              <img
                @click.stop
                class="min-h-[20%] max-h-full self-center object-contain"
                :src="imageUrl"
              />
            </div>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
