<script setup lang="ts">
defineProps<{ imageUrls: string[] | null }>()
</script>

<template>
  <div v-if="$props.imageUrls?.length" class="mt-3 rounded-2xl overflow-hidden border-[1px]">
    <!-- Single -->
    <template v-if="$props.imageUrls.length === 1" v-for="imageUrl in $props.imageUrls">
      <a @click.stop :href="imageUrl" target="_blank">
        <img class="w-full h-full object-cover" :src="imageUrl" />
      </a>
    </template>
    <!-- Even -->
    <template v-else-if="$props.imageUrls.length === 2 || $props.imageUrls.length === 4">
      <div class="grid grid-cols-2 gap-[1px]">
        <div v-for="imageUrl in $props.imageUrls">
          <a @click.stop :href="imageUrl" target="_blank">
            <img class="w-full h-full object-cover" :src="imageUrl" />
          </a>
        </div>
      </div>
    </template>
    <!-- 3 images -->
    <template v-else-if="$props.imageUrls.length === 3">
      <div class="flex divide-x-2">
        <a @click.stop :href="$props.imageUrls[0]" target="_blank">
          <img class="w-full h-full object-cover" :src="$props.imageUrls[0]" />
        </a>
        <div class="flex flex-col divide-y-2">
          <a @click.stop :href="$props.imageUrls[1]" target="_blank">
            <img class="w-full h-full object-cover" :src="$props.imageUrls[1]" />
          </a>
          <a @click.stop :href="$props.imageUrls[2]" target="_blank">
            <img class="w-full h-full object-cover" :src="$props.imageUrls[2]" />
          </a>
        </div>
      </div>
    </template>
  </div>
</template>
-
