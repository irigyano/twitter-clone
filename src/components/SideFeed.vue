<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
import { Search } from 'lucide-vue-next'
import { ref } from 'vue'

const searchQuery = ref('')
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
          v-model="searchQuery"
          @keypress.enter="router.push(`/search?q=${searchQuery}`)"
        />
      </label>
    </div>
  </footer>
</template>
