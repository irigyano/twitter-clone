<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col w-full items-end pr-8 border-r-[1px] border-gray-700">
    <RouterLink to="/">首頁</RouterLink>
    <RouterLink to="/sense">個人資料</RouterLink>
  </div>
</template>
