<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <footer class="hidden lg:flex flex-[0.25]">
    <div class="flex flex-col flex-1 items-start px-10 max-w-[300px]">
      <div class="sticky top-4">
        <SearchBar />
      </div>
    </div>
  </footer>
</template>
