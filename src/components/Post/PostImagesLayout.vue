<script setup lang="ts">
import PostImageDialog from '@/components/Post/PostImageDialog.vue'
defineProps<{ imageUrls: string[] | null }>()
</script>

<template>
  <div v-if="$props.imageUrls?.length" class="mt-3 rounded-2xl overflow-hidden border-[1px]">
    <!-- Single -->
    <template v-if="$props.imageUrls.length === 1">
      <PostImageDialog v-for="imageUrl in $props.imageUrls" :key="imageUrl" :image-url="imageUrl" />
    </template>
    <!-- Even -->
    <template v-else-if="$props.imageUrls.length % 2 === 0">
      <div class="grid grid-cols-2 gap-[1px]">
        <PostImageDialog
          v-for="imageUrl in $props.imageUrls"
          :key="imageUrl"
          :image-url="imageUrl"
        />
      </div>
    </template>
    <!-- 3 images -->
    <template v-else-if="$props.imageUrls.length === 3">
      <div class="grid grid-cols-2 divide-x-2">
        <PostImageDialog :image-url="$props.imageUrls[0]" />
        <div class="grid grid-rows-2 divide-y-2">
          <PostImageDialog :image-url="$props.imageUrls[1]" />
          <PostImageDialog :image-url="$props.imageUrls[2]" />
        </div>
      </div>
    </template>
  </div>
</template>
-
