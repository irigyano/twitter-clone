import { supabase } from '@/utils/supabase'

export async function wordFrequenciesRpc() {
  const { data, error } = await supabase.rpc('word_frequencies').limit(8)
  if (error) throw new Error(error.message)
  return data
}
