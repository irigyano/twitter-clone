<script setup lang="ts">
// https://github.com/supabase/supabase-js/issues/244
defineProps<{
  content: string | null
  imageSrc: string | null
  author: string
  tag: string
  avatar: string | null
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
        :src="avatar || ''"
      />
    </div>
    <div class="flex-1">
      <div>{{ author }} @{{ tag }}</div>
      <pre class="text-wrap break-all">{{ content }}</pre>
      <img class="rounded-3xl w-full pt-2" v-if="imageSrc" :src="imageSrc" />
    </div>
  </div>
</template>
