<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
const password = defineModel<string>()
const showPassword = ref(false)
</script>

<template>
  <Label for="password">密碼</Label>
  <div class="relative">
    <Input
      required
      v-model="password"
      minlength="6"
      maxlength="30"
      id="password"
      :type="showPassword ? 'text' : 'password'"
    />
    <div
      v-if="password"
      @click="showPassword = !showPassword"
      class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary duration-300"
    >
      <Eye v-if="!showPassword" />
      <EyeOff v-if="showPassword" class="text-primary" />
    </div>
  </div>
</template>
