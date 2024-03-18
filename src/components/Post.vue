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
  <div class="flex gap-2">
    <div>
      <img alt="avatar" class="min-w-10 h-10 rounded-full" width="40" height="40" :src="avatar" />
    </div>
    <div class="flex-1">
      <div>{{ author }} @{{ tag }}</div>
      <pre class="text-wrap break-all">{{ content }}</pre>
      <img class="rounded-xl" v-if="true" :src="imageSrc" />
    </div>
  </div>
</template>
