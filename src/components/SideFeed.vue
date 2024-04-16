<script setup lang="ts">
import { Search } from 'lucide-vue-next'
</script>

<template>
  <footer class="hidden sm:flex flex-[0.25]">
    <div class="flex flex-col w-full items-start px-10 border-l-[1px] border-gray-700">
      <label class="sticky top-0 flex items-center pt-3" for="searchInput">
        <div class="absolute pl-2">
          <Search :size="24" />
        </div>
        <input
          id="searchInput"
          placeholder="搜尋"
          class="pl-10 flex w-full rounded-full h-10 max-w-[350px] bg-gray-700"
        />
      </label>
    </div>
  </footer>
</template>
