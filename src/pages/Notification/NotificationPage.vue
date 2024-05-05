<script setup lang="ts">
import PageNav from '@/components/Layout/PageNav.vue'
import { useUserStore } from '@/stores/user'
import { getNotificationsByUserId } from '@/utils/services'
import { useQuery } from '@tanstack/vue-query'
import { Heart, UserRound, Repeat2, MessageCircleMore } from 'lucide-vue-next'
import Notification from '@/pages/Notification/Notification.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
const userStore = useUserStore()

const { isLoading, data: notifications } = useQuery({
  queryKey: [userStore.user.id + 'Notifications'],
  queryFn: () => getNotificationsByUserId(userStore.user.id),
  retry: false
})
</script>

<template>
  <div class="flex-1">
    <PageNav :title="'通知'" />
    <LoadingSpinner v-if="isLoading" />

    <div v-else-if="!notifications?.length" class="text-center font-bold text-3xl">
      還沒有可查看的資訊
    </div>

    <div v-else-if="notifications" class="flex flex-col border-b-[1px]">
      <template v-for="notification in notifications">
        <template v-if="notification.actioner">
          <Notification
            v-if="notification.action === 'follow'"
            :avatar="notification.actioner.avatar"
            :tag="notification.actioner.tag"
            :name="notification.actioner.name"
            :isRead="notification.is_read"
          >
            <template #svg>
              <UserRound :size="24" class="text-blue-500 fill-blue-500" />
            </template>
            <template #text> 跟隨了你！</template>
          </Notification>

          <Notification
            v-else-if="notification.action === 'comment'"
            :avatar="notification.actioner.avatar"
            :tag="notification.actioner.tag"
            :name="notification.actioner.name"
            :isRead="notification.is_read"
          >
            <template #svg>
              <MessageCircleMore :size="24" class="text-yellow-500" />
            </template>
            <template #text>
              在你的<RouterLink
                class="text-primary hover:underline"
                :to="`/post/${notification.post_id}`"
                >貼文</RouterLink
              >新增了回覆！</template
            >
          </Notification>

          <Notification
            v-else-if="notification.action === 'retweet'"
            :avatar="notification.actioner.avatar"
            :tag="notification.actioner.tag"
            :name="notification.actioner.name"
            :isRead="notification.is_read"
          >
            <template #svg>
              <Repeat2 :size="24" class="text-green-500" />
            </template>
            <template #text>
              轉推了你的<RouterLink
                class="text-primary hover:underline"
                :to="`/post/${notification.post_id}`"
                >貼文</RouterLink
              >！
            </template>
          </Notification>

          <Notification
            v-else-if="notification.action === 'like'"
            :avatar="notification.actioner.avatar"
            :tag="notification.actioner.tag"
            :name="notification.actioner.name"
            :isRead="notification.is_read"
          >
            <template #svg>
              <Heart :size="24" class="text-red-500 fill-red-500" />
            </template>
            <template #text>
              喜歡了你的<RouterLink
                class="text-primary hover:underline"
                :to="`/post/${notification.post_id}`"
                >貼文</RouterLink
              >！</template
            >
          </Notification>
        </template>
      </template>
    </div>
  </div>
</template>
