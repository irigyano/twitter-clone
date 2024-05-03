import type { Tweet } from '@/types/queries'

export function sortTweetsByCreatedAt(tweets: Tweet[]) {
  tweets.sort((b, a) => {
    let createdA = a.isRetweet ? a.retweetedAt! : a.post.created_at
    let createdB = b.isRetweet ? b.retweetedAt! : b.post.created_at
    return new Date(createdA).getTime() - new Date(createdB).getTime()
  })
}

export function readFileToBlob(file: File) {
  const blob = URL.createObjectURL(file)
  return blob
}

// Starts with `#` and Chinese/Japanese/English letters.
export function isHashtag(word: string) {
  const regex = /^#[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFa-zA-Z]+$/
  if (regex.test(word)) {
    return word
  }
}

// Starts with `@` and consists English letters, numbers and underscore.
export function isMention(word: string) {
  const regex = /^@[a-zA-Z0-9_]+$/
  if (regex.test(word)) {
    return word
  }
}

export function isYoutube(word: string) {
  try {
    const url = new URL(word)
    if (url.origin === 'https://www.youtube.com') {
      const searchParams = url.search
      if (url.pathname === '/watch') {
        const videoId = searchParams.split('?v=')[1].split('&')[0]
        return `https://www.youtube.com/embed/${videoId}`
      }
      if (url.pathname === '/playlist') {
        const videoId = searchParams.split('?list=')[1]
        return `https://www.youtube.com/embed/videoseries?list=${videoId}`
      }
    }
  } catch {}
  return undefined
}

export function isUrl(word: string) {
  if (word.startsWith('https://') && word.length > 8) {
    return word.slice(8)
  }
}

export function splitContentToWords(content: string | null, media: boolean = false) {
  if (!content) return []

  const lines = content.split('\n')

  const article: string[] = []
  const youtubeCache = new Set()

  for (let line of lines) {
    const words = line.replaceAll('　', ' ').split(' ')
    for (let word of words) {
      if (isYoutube(word) && media) {
        youtubeCache.add(word)
      } else article.push(word)
    }
  }

  if (youtubeCache.size) {
    youtubeCache.forEach((a) => {
      article.push(a as string)
    })
  } else article.push('\n')

  return article
}
