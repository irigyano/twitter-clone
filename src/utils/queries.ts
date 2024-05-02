import { supabase } from '@/utils/supabase'
import type { Comment, PostInfo, User } from '@/types/queries'
import type { PostInfoWithAuthor, RetweetInfo, FollowWithUser } from '@/types/queries'

// User

export async function queryUserMetaById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*, follows!follower(followee)')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function queryUserMetaByTag(tag: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      '*, posts(*), retweets(*),\
      following:follows!follower(followee),\
      follower:follows!followee(follower)'
    )
    .eq('tag', tag)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function queryUserFollowByTag(tag: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      '*, \
      following:follows!follower(*, user:users!public_follows_followee_fkey(*, follows!public_follows_followee_fkey(*))), \
      follower:follows!followee(*, user:users!public_follows_follower_fkey(*, follows!public_follows_followee_fkey(*)))'
    )
    .eq('tag', tag)
    .single()
  if (error) throw new Error(error.message)
  return data as User & {
    following: Array<FollowWithUser>
    follower: Array<FollowWithUser>
  }
}

// Post

export async function queryPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(*), comments(*), likes(*), retweets(*)')
  if (error) throw new Error(error.message)
  return data as PostInfoWithAuthor[]
}

export async function queryPostsByTextSearch(keyword: string) {
  if (!keyword) throw new Error('No keyword provided')

  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(*), comments(*), likes(*), retweets(*)')
    .textSearch('content', keyword, {
      type: 'websearch'
    })
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as PostInfoWithAuthor[]
}

export async function queryPostById(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      '*,\
      user:users(*, follower:follows!followee(follower)),\
      comments(*),\
      likes(*),\
      retweets(*)'
    )
    .order('created_at', { ascending: false, referencedTable: 'comments' })
    .eq('id', postId)
    .single()
  if (error) throw new Error(error.message)
  return data as PostInfo & { user: User & { follower: Array<{ follower: string }> } }
}

// Comments

export async function queryCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:users(*)')
    .eq('postId', postId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  return data as (Comment & { user: User })[]
}

export async function queryRetweets() {
  const { data, error } = await supabase.from('retweets').select(
    '*,\
      retweeter:users(*),\
      retweetedPost:posts(*, user:users(*), comments(*), likes(*), retweets(*))'
  )
  if (error) throw new Error(error.message)
  return data as RetweetInfo[]
}

export async function queryUserPostsByTag(tag: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users!inner(*), comments(*), likes(*), retweets(*)')
    .eq('user.tag', tag)

  if (error) throw new Error(error.message)
  return data as PostInfoWithAuthor[]
}

export async function queryUserRetweetsByTag(tag: string) {
  const { data, error } = await supabase
    .from('retweets')
    .select(
      '*,\
      retweeter:users!inner(*),\
      retweetedPost:posts(*, user:users(*), comments(*), likes(*), retweets(*))'
    )
    .eq('retweeter.tag', tag)
  if (error) throw new Error(error.message)
  return data as RetweetInfo[]
}

export async function queryNotificationsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*, actioner:users!notifications_actioner_id_fkey(*)')
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}
