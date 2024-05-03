<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/shadcn'
import { isHashtag, isMention, isUrl, isYoutube, splitContentToWords } from '@/utils/helper'
defineProps<{
  content: string | null
  class?: HTMLAttributes['class']
  media?: boolean
}>()
</script>

<template>
  <span :class="cn('whitespace-pre-line break-all', $props.class)">
    <template v-for="word in splitContentToWords($props.content, media)">
      <!-- hashtag -->
      <RouterLink
        v-if="isHashtag(word)"
        @click.stop
        :to="`/search?q=${word.slice(1)}`"
        class="text-primary hover:underline"
        >{{ word }}</RouterLink
      >
      <!-- mention -->
      <RouterLink
        v-else-if="isMention(word)"
        @click.stop
        :to="`/${word.slice(1)}`"
        class="text-primary hover:underline"
        >{{ word }}</RouterLink
      >
      <!-- Youtube -->
      <iframe
        v-else-if="isYoutube(word) && media"
        class="w-full aspect-video rounded-3xl border-2 mt-3"
        :src="isYoutube(word)"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <!-- url -->
      <a
        v-else-if="isUrl(word)"
        @click.stop
        :href="word"
        target="_blank"
        class="text-primary hover:underline"
        >{{ isUrl(word) }}</a
      >
      <!-- normal word -->
      <span v-else>
        {{ word }}
      </span>
      <!-- add space back which was replaced by `.split()` -->
      {{ '' }}
    </template>
  </span>
</template>
