import {
  queryPosts,
  queryRetweets,
  queryPostsByTextSearch,
  queryUserMetaByTag,
  queryUserPostByTag,
  queryUserRetweetsByTag
} from '@/utils/query'
import { pipePostsToTweets, pipeRetweetsToTweets } from '@/utils/pipes'
import { sortTweetsByCreatedAt } from '@/utils/helper'

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

export async function getTweets() {
  const promises = [getPipedTweets(), getPipedRetweets()]
  const [t1, t2] = await Promise.all(promises)
  const tweets = t1.concat(t2)

  sortTweetsByCreatedAt(tweets)
  return tweets
}

export async function getPostsByTextSearch(keyword: string) {
  const data = await queryPostsByTextSearch(keyword)
  const piped = pipePostsToTweets(data)
  return piped
}

// REVISIT: Rename function if we have more format of user data in the future
export async function getUserMetaByTag(tag: string) {
  const data = await queryUserMetaByTag(tag)
  return data
}

async function getPipedTweetsByTag(tag: string) {
  const data = await queryUserPostByTag(tag)
  const piped = pipePostsToTweets(data)
  return piped
}
async function getPipedRetweetsByTag(tag: string) {
  const data = await queryUserRetweetsByTag(tag)
  const piped = pipeRetweetsToTweets(data)
  return piped
}

export async function getTweetsByTag(tag: string) {
  const promises = [getPipedTweetsByTag(tag), getPipedRetweetsByTag(tag)]
  const [t1, t2] = await Promise.all(promises)
  const tweets = t1.concat(t2)

  sortTweetsByCreatedAt(tweets)
  return tweets
}
