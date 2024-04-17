<script setup lang="ts">
import { useRoute } from 'vue-router'

// TODO: dynamic title

const route = useRoute()
</script>

<template>
  <div>{{ route.query.q }}</div>
</template>
