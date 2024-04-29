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
  imageSrc?: string[]
  userId: string
}) {
  const { error } = await supabase.from('posts').insert({ content, imageSrc, userId })
  if (error) throw new Error(error.message)
}

export async function insertComment(userId: string, postId: string, comment: string) {
  const { error } = await supabase
    .from('comments')
    .insert({ userId, postId, comment: comment.trim() })
  if (error) throw new Error(error.message)
}

export async function deleteCommentById(commentId: string) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (error) throw new Error(error.message)
}

export async function uploadImage(file: File, storage: 'avatar' | 'background-cover' | 'post') {
  const fileExt = file.name.split('.').pop()
  const filePath = `${String(Math.random()).slice(2)}.${fileExt}`

  const { data, error } = await supabase.storage.from(storage).upload(filePath, file)
  if (error) throw new Error(error.message)

  return `${import.meta.env.VITE_SUPABASE_BUCKETS}/${storage}/${data.path}`
}

export async function uploadMultipleImages(imagesBuffer: File[]) {
  const uploadPromises: Array<Promise<string>> = []

  for (let image of imagesBuffer) {
    uploadPromises.push(uploadImage(image, 'post'))
  }

  const imagesUrl = await Promise.all(uploadPromises)
  return imagesUrl
}
