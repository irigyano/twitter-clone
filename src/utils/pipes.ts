import type { PostInfoWithAuthor, RetweetInfo, Tweet } from '@/types/queries'

export function pipePostsToTweets(posts: PostInfoWithAuthor[]) {
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
  return piped as Tweet[]
}

export function pipeRetweetsToTweets(retweets: RetweetInfo[]) {
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
  return piped as Tweet[]
}
