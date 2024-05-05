<script setup lang="ts">
import vue from '@/assets/images/Vue.png'
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col justify-center max-w-[300px] mx-auto">
      <img :src="vue" alt="vue_logo" width="1920" height="1080" />
      <RouterView />
    </div>
  </div>
</template>
