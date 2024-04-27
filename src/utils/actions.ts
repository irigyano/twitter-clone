import { supabase } from '@/utils/supabase'

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
