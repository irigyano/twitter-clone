<script setup lang="ts">
import { useHead } from 'unhead'

useHead({
  title: 'Hello World'
})
</script>

<template>
  <div>{{ $route.params.user }}</div>
</template>
