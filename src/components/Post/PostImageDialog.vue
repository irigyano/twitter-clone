<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
defineProps<{ imageUrl: string }>()
</script>

<template>
  <Dialog>
    <DialogTrigger class="flex" @click.stop>
      <img class="object-cover h-full w-full" :src="imageUrl" />
    </DialogTrigger>
    <DialogContent class="max-w-full h-full flex justify-between p-0">
      <div class="flex flex-1 justify-center p-4">
        <img class="object-contain" :src="imageUrl" />
      </div>
      <!-- <div class="hidden lg:block max-w-[300px] flex-1 border-l-[1px]">Post Metas</div> -->
    </DialogContent>
  </Dialog>
</template>
