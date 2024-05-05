import { supabase } from '@/utils/supabase'

export async function wordFrequenciesRpc() {
  const { data, error } = await supabase.rpc('word_frequencies').limit(10)
  if (error) throw new Error(error.message)
  return data
}

export async function getUnfollowByUserId(userId: string) {
  const { data, error } = await supabase
    .rpc('get_unfollow_by_user_id', {
      user_uuid: userId
    })
    .limit(3)

  if (error) throw Error(error.message)

  return data
}
