<script setup lang="ts">
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/stores/user'
import { UserPlus, UserMinus } from 'lucide-vue-next'
const userStore = useUserStore()

const { authorId } = defineProps<{ authorId: string }>()
const amIReactive = userStore.user.follows.some(({ followee }) => followee === authorId)
</script>

<template>
  <DropdownMenuItem v-if="userStore.user.id !== authorId">
    <template v-if="amIReactive">
      <UserMinus class="mr-2 h-4 w-4" />
      <span>取消跟隨</span>
    </template>
    <template v-if="!amIReactive">
      <UserPlus class="mr-2 h-4 w-4" />
      <span>跟隨</span>
    </template>
  </DropdownMenuItem>
</template>
