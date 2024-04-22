import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

type Storage = 'avatar' | 'background-cover' | 'post'

export const useUploadImage = async (event: Event, storage: Storage) => {
  const files = ref()

  files.value = (event.target as HTMLInputElement).files
  if (!files.value || files.value.length === 0) return

  const file = files.value[0]
  const fileExt = file.name.split('.').pop()
  const filePath = `${Math.random()}.${fileExt}`

  const { data, error } = await supabase.storage.from(storage).upload(filePath, file)
  if (error) throw new Error(error.message)
  files.value = null

  return `${import.meta.env.VITE_SUPABASE_BUCKETS}/${(data as any).fullPath}`
}
