import { defineStore } from 'pinia'
import type { Session } from '@supabase/supabase-js'
import type { UserMeta } from '@/types/queries'

export const useUserStore = defineStore('user', {
  state: () => {
    // User would always be true since if no session we instantly exit the app
    return { session: null as Session | null, user: null as unknown as UserMeta }
  }
})
