<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="flex-col flex-[0.2] hidden sm:flex">
    <RouterLink to="/">首頁</RouterLink>
    <RouterLink to="/sense">個人資料</RouterLink>
  </nav>
</template>
