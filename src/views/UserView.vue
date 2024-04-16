<script setup lang="ts">
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useHead } from 'unhead'
import { onBeforeMount, ref, toRefs } from 'vue'
import Post from '@/components/Post.vue'
const route = useRoute()
const user = ref<User>(null)

type User = Awaited<ReturnType<typeof getUserFromSupabase>>
async function getUserFromSupabase() {
  const { data, error } = await supabase
    .from('users')
    .select('*, posts(*, comments(*), likes(*))')
    .eq('tag', route.params.user)
    .single()

  return data
}

onBeforeMount(async () => {
  const data = await getUserFromSupabase()
  if (!data) return
  useHead({
    title: `${data.name} (@${data.tag}) / Webber`
  })
  user.value = data
})
</script>

<template>
  <!-- Q: better approach than w-full? -->
  <div v-if="user" class="g-red-500 w-full">
    <div>{{ user.name }}</div>
    <div class="bg-blue-500">banner</div>
    <div class="bg-green-500 flex justify-between">
      <div>avatar</div>
      <div>edit button</div>
    </div>
    <div>{{ user.name }}</div>
    <div>@{{ user.tag }}</div>
    <pre>{{ user.bio || 'no bio' }}</pre>
    <div>{{ user.created_at }}</div>
    <div class="flex gap-2 border-b-[1px] border-gray-700">
      <div>following</div>
      <div>followers</div>
    </div>
    <!-- n starts with 1 -->
    <div v-for="n in user.posts.length">
      <Post :author="user" :post="user.posts[n - 1]" />
    </div>
  </div>
</template>
