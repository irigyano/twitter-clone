<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/shadcn'

defineProps<{ content: string | null; class?: HTMLAttributes['class'] }>()

function isHashtag(word: string) {
  // If word starts with `#` and its valid Chinese/Japanese/English letters
  const regex = /^#[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFa-zA-Z]+$/
  if (regex.test(word)) {
    return word
  }
}

function isMention(word: string) {
  // If word starts with `@` and it only consists English letters, numbers, underscore
  const regex = /^@[a-zA-Z0-9_]+$/
  if (regex.test(word)) {
    return word
  }
}

function isUrl(word: string) {
  if (word.startsWith('https://') && word.length > 8) {
    return word.slice(8)
  }
}
</script>

<template>
  <span v-if="content" :class="cn('whitespace-pre-line break-all', $props.class)">
    <!-- Split content into lines by newline character -->
    <template v-for="line in content.split('\n')">
      <!-- Split words from trimmed line  -->
      <template v-for="word in line.replaceAll('　', ' ').split(' ')">
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
      <!-- add newline character back which was replaced by `.split()` -->
      {{ '\n' }}
    </template>
  </span>
</template>
