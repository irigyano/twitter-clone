import { queryPosts, queryRetweets } from '@/utils/query'
import type { PostInfoWithAuthor, RetweetInfo, Tweet } from '@/types/queries'

export async function getPostsAndRetweets() {
  const promises = [getPipedTweets(), getPipedRetweets()]
  const [t1, t2] = await Promise.all(promises)
  const tweets = t1.concat(t2) as Tweet[]

  tweets.sort((b, a) => {
    let createdA = a.isRetweet ? a.retweetedAt! : a.post.created_at
    let createdB = b.isRetweet ? b.retweetedAt! : b.post.created_at
    return new Date(createdA).getTime() - new Date(createdB).getTime()
  })

  return tweets
}

// Tweets

async function getPipedTweets() {
  const data = await queryPosts()
  const piped = pipePostsToTweets(data)
  return piped
}

function pipePostsToTweets(posts: PostInfoWithAuthor[]) {
  const piped = posts.map((post) => {
    const { user, ...tweet } = post
    return {
      // NOTE: User is a referenced foreign key so wouldn't be null.
      id: tweet.id,
      author: user,
      post: tweet,
      isRetweet: false
    }
  })
  return piped
}

// Retweets

async function getPipedRetweets() {
  const data = await queryRetweets()
  const piped = pipeRetweetsToTweets(data)
  return piped
}

function pipeRetweetsToTweets(retweets: RetweetInfo[]) {
  const piped = retweets.map((retweet) => {
    return {
      id: retweet.id,
      author: retweet.retweetedPost.user,
      post: retweet.retweetedPost,
      isRetweet: true,
      retweeter: retweet.retweeter,
      retweetedAt: retweet.created_at
    }
  })
  return piped
}

// export async function getPostsAndRetweetsByUserId(){
// }
