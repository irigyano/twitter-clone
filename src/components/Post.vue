<script setup lang="ts">
defineProps<{
  content?: string
  imageSrc?: string
  author: string
  tag: string
  avatar?: string
}>()
</script>

<template>
  <div class="flex gap-2 px-4 pt-2 border-b-[1px] border-gray-700">
    <div>
      <img
        alt="avatar"
        class="min-w-10 h-10 rounded-full object-cover"
        width="40"
        height="40"
        :src="avatar"
      />
    </div>
    <div class="flex-1">
      <div>{{ author }} @{{ tag }}</div>
      <pre class="text-wrap break-all">{{ content }}</pre>
      <img class="rounded-3xl w-full pt-2" v-if="true" :src="imageSrc" />
    </div>
  </div>
</template>
