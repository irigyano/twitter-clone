import { defineStore } from 'pinia'
import type { Session } from '@supabase/supabase-js'
import type { UserMeta } from '@/types/queries'

export const useUserStore = defineStore('user', {
  state: () =>
    // User would always be true due to routing guard
    ({ session: null as Session | null, user: null as unknown as UserMeta }),

  actions: {
    addFollowing(userId: string) {
      this.user.follows.push({ followee: userId })
    },

    removeFollowing(userId: string) {
      const index = this.user.follows.findIndex(({ followee }) => followee === userId)
      this.user.follows.splice(index, 1)
    }
  }
})
