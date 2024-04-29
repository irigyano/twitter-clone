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
