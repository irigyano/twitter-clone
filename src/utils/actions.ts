import { supabase } from '@/utils/supabase'
import type { User, FollowNotify, PostNotify } from '@/types/queries'

export async function followUser(userId: string, targetUserId: string) {
  const { data, error } = await supabase
    .from('follows')
    .insert({ follower: userId, followee: targetUserId })
    .select('id')
    .single()
  if (error) throw new Error(error.message)

  insertNotification({
    action: 'follow',
    actioner_id: userId,
    receiver_id: targetUserId,
    follow_id: data.id
  })
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
  const { data, error } = await supabase
    .from('comments')
    .insert({ userId, postId, comment: comment.trim() })
    .select('post:posts(id,userId)')
    .single()
  if (error) throw new Error(error.message)

  // post is non-nullable so casting here its fine
  const post = data.post!
  // Insert notification to owner if its from other user
  if (userId !== post.userId)
    insertNotification({
      action: 'comment',
      actioner_id: userId,
      receiver_id: post.userId,
      post_id: post.id
    })
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

export async function insertNotification<T extends FollowNotify | PostNotify>(insertion: T) {
  const { error } = await supabase.from('notifications').insert(insertion)
  if (error) throw new Error(error.message)
}

export async function insertRetweet(user_id: string, post_id: string) {
  const { data, error } = await supabase
    .from('retweets')
    .insert({ user_id, post_id })
    .select('post:posts(userId)')
    .single()
  if (error) throw new Error(error.message)

  const post = data.post!
  if (user_id !== post.userId)
    insertNotification({
      action: 'retweet',
      actioner_id: user_id,
      receiver_id: post.userId,
      post_id
    })
}

export async function deleteRetweet(user_id: string, post_id: string) {
  const { error } = await supabase
    .from('retweets')
    .delete()
    .eq('user_id', user_id)
    .eq('post_id', post_id)
  if (error) throw new Error(error.message)
}
