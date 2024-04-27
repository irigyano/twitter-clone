import { queryPosts, queryRetweets, queryPostsByTextSearch } from '@/utils/query'
import { pipePostsToTweets, pipeRetweetsToTweets } from '@/utils/pipes'

async function getPipedTweets() {
  const data = await queryPosts()
  const piped = pipePostsToTweets(data)
  return piped
}

async function getPipedRetweets() {
  const data = await queryRetweets()
  const piped = pipeRetweetsToTweets(data)
  return piped
}

export async function getPostsAndRetweets() {
  const promises = [getPipedTweets(), getPipedRetweets()]
  const [t1, t2] = await Promise.all(promises)
  const tweets = t1.concat(t2)

  tweets.sort((b, a) => {
    let createdA = a.isRetweet ? a.retweetedAt! : a.post.created_at
    let createdB = b.isRetweet ? b.retweetedAt! : b.post.created_at
    return new Date(createdA).getTime() - new Date(createdB).getTime()
  })

  return tweets
}

export async function getPostsByTextSearch(keyword: string) {
  const data = await queryPostsByTextSearch(keyword)
  const piped = pipePostsToTweets(data)
  return piped
}
