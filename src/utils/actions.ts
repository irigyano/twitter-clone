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

export async function deletePostById(postId: string) {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw new Error(error.message)
}

export async function insertPost({
  content,
  imageSrc,
  userId
}: {
  content?: string
  imageSrc?: string
  userId: string
}) {
  const { error } = await supabase.from('posts').insert({ content, imageSrc, userId })
  if (error) throw new Error(error.message)
}

export async function insertComment(userId: string, postId: string, comment: string) {
  const { error } = await supabase.from('comments').insert({ userId, postId, comment })
  if (error) throw new Error(error.message)
}
