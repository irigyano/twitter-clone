import { supabase } from '@/utils/supabase'
import type { User } from '@/types/queries'
import type { PostInfoWithAuthor, RetweetInfo } from '@/types/queries'

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

export async function queryPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(*), comments(*), likes(*), retweets(*)')
  if (error) throw new Error(error.message)
  return data as PostInfoWithAuthor[]
}

export async function getPostById(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      '*,\
      user:users(*,following:follows!follower(followee),\
      follower:follows!followee(follower)),\
      comments(*,user:users(*)),\
      likes(*,user:users(*)),\
      retweets(*)'
    )
    .order('created_at', { ascending: false, referencedTable: 'comments' })
    .eq('id', postId)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateUserMetaByTag(tag: string, data: Partial<User>) {
  const { error } = await supabase.from('users').update(data).eq('tag', tag).single()
  if (error) throw new Error(error.message)
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

export async function getUserFollowRelationByTag(tag: string) {
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
  return data as any
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

export async function queryUserPostByTag(tag: string) {
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
