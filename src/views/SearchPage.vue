<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from 'unhead'
const route = useRoute()

useHead({
  title: `${route.query.q} - 搜尋 / Webber`
})
</script>

<template>
  <div>{{ route.query.q }}</div>
</template>
