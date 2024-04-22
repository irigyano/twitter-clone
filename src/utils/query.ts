import { supabase } from '@/utils/supabase'

export async function getUserWithTag(tag: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*, posts(*, comments(*), likes(*))')
    .order('created_at', { ascending: false, referencedTable: 'posts' })
    .eq('tag', tag)
    .single()
  if (!data) throw new Error('No user found')
  return data
}

export type Post = Awaited<ReturnType<typeof getPosts>>[number]
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(*), comments(*), likes(*)')
    .order('created_at', { ascending: false })

  const trimmed = data?.map((post) => {
    const { user, ...rest } = post
    return {
      author: user!,
      post: rest
    }
  })

  return trimmed || []
}

export type Comment = Awaited<ReturnType<typeof getPostById>>['comments'][number]
export async function getPostById(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(*), comments(*,user:users(*)), likes(*,user:users(*))')
    .order('created_at', { ascending: false, referencedTable: 'comments' })
    .eq('id', postId)
    .single()
  if (error) throw new Error(error.message)

  return data
}

export async function updateUserMetaByTag(tag: string, data: Partial<Post['author']>) {
  const { error } = await supabase.from('users').update(data).eq('tag', tag).single()
  if (error) throw new Error(error.message)
}
