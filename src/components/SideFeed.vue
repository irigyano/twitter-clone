<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
import { Search, CircleX } from 'lucide-vue-next'
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <footer class="hidden lg:flex flex-[0.25]">
    <div class="flex flex-col flex-1 items-start px-10">
      <label
        class="sticky top-4 p-1 flex w-full items-center bg-secondary rounded-full max-w-[300px]"
        for="searchInput"
      >
        <div class="p-2">
          <Search :size="18" />
        </div>
        <input
          id="searchInput"
          placeholder="搜尋"
          class="h-full focus:outline-none focus:ring-0 pr-2 bg-transparent w-full placeholder:text-muted-foreground"
          v-model="searchQuery"
          @keypress.enter="router.push(`/search?q=${searchQuery}`)"
        />
        <div
          class="p-2 cursor-pointer hover:text-primary duration-300"
          v-if="searchQuery"
          @click="searchQuery = ''"
        >
          <CircleX :size="18" />
        </div>
      </label>
    </div>
  </footer>
</template>
