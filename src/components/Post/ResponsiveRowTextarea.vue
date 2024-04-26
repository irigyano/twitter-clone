<script setup lang="ts">
import { ref, watch } from 'vue'
const textarea = ref<HTMLTextAreaElement | null>(null)
const commentContent = defineModel<string>()

function shrinkTextareaRows() {
  if (!textarea.value) return
  textarea.value.style.height = '28px'
  if (textarea.value.scrollHeight > 28)
    textarea.value.style.height = `${textarea.value.scrollHeight + 4}px` // 4px offset for the border
}
watch(commentContent, (value) => {
  if (!value) return (textarea.value!.style.height = '28px') // reset after sumbit
  shrinkTextareaRows()
})
</script>

<template>
  <textarea
    ref="textarea"
    rows="1"
    v-model="commentContent"
    placeholder="發佈你的回覆"
    :class="`placeholder-muted-foreground text-lg font-semibold overflow-y-hidden w-full bg-transparent focus:outline-none rounded-md px-2 resize-none`"
  ></textarea>
</template>
