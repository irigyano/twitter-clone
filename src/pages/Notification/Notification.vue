<script setup lang="ts">
import PostAvatar from '@/components/UserAvatar.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Check } from 'lucide-vue-next'
import { updateNotification } from '@/utils/actions'
const queryClient = useQueryClient()
const props = defineProps<{
  avatar: string | null
  tag: string
  name: string
  isRead: boolean
  id: string
}>()

const { mutate } = useMutation({
  mutationFn: () => updateNotification(props.id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['Notifications'] })
  }
})
</script>

<template>
  <div class="flex border-t-[1px] p-2 relative" :class="isRead ? 'bg-background' : 'bg-secondary'">
    <div class="p-2">
      <slot name="svg" />
    </div>
    <div>
      <PostAvatar :avatar="avatar" :tag="tag" />
      <div class="break-all">
        <RouterLink :to="`/${tag}`" class="font-bold hover:underline">{{ name }}</RouterLink>
        <slot name="text" />
      </div>
    </div>
    <div
      v-if="!isRead"
      @click="mutate()"
      class="absolute right-2 hover:text-green-500 cursor-pointer duration-300"
    >
      <Check />
    </div>
  </div>
</template>
