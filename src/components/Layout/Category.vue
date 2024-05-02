<script setup lang="ts">
const showFollow = defineModel<boolean>()
</script>

<template>
  <div
    class="flex sticky top-0 z-10 bg-background/50 backdrop-blur-md w-full h-14 items-center font-bold border-b-[1px]"
  >
    <div
      class="flex-1 h-full flex items-center justify-center hover:bg-secondary duration-300 cursor-pointer"
      @click="showFollow = false"
    >
      <span>為你推薦</span>
    </div>
    <div
      class="flex-1 h-full flex items-center justify-center hover:bg-secondary duration-300 cursor-pointer"
      @click="showFollow = true"
    >
      <span>正在跟隨</span>
    </div>

    <div class="absolute bottom-0 w-full flex justify-center">
      <div
        class="h-1 w-1/4 rounded-full bg-primary duration-300"
        :class="showFollow ? 'translate-x-full' : '-translate-x-full'"
      ></div>
    </div>
  </div>
</template>
