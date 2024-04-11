import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_ENDPOINT
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_TOKEN

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
