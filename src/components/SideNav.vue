<script setup lang="ts">
import SideNavItem from '@/components/SideNavItem.vue'
import { Home, UserRound } from 'lucide-vue-next'
</script>

<template>
  <div class="flex w-full flex-col items-end pr-8 border-r-[1px] border-gray-700 pt-4">
    <div class="w-1/2 flex flex-col gap-2">
      <div>Logo</div>
      <SideNavItem location="/" title="首頁">
        <Home :size="24" />
      </SideNavItem>
      <SideNavItem location="/sense" title="個人資料">
        <UserRound :size="24" />
      </SideNavItem>
    </div>
  </div>
</template>
