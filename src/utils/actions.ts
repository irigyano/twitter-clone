import { supabase } from '@/utils/supabase'
import type { User } from '@/types/queries'

export async function followUser(userId: string, targetUserId: string) {
  const { error } = await supabase
    .from('follows')
    .insert({ follower: userId, followee: targetUserId })
  if (error) throw new Error(error.message)
}

export async function unfollowUser(userId: string, targetUserId: string) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower', userId)
    .eq('followee', targetUserId)
  if (error) throw new Error(error.message)
}

export async function updateUserMetaByTag(tag: string, data: Partial<User>) {
  const { error } = await supabase.from('users').update(data).eq('tag', tag).single()
  if (error) throw new Error(error.message)
}
