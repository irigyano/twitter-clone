import {
  queryPosts,
  queryRetweets,
  queryPostsByTextSearch,
  queryUserMetaByTag,
  queryUserPostsByTag,
  queryUserRetweetsByTag,
  queryUserFollowByTag,
  queryPostById,
  queryCommentsByPostId,
  queryNotificationsByUserId,
  queryFollowTweetsByUserId
} from '@/utils/queries'
import { pipePostsToTweets, pipeRetweetsToTweets } from '@/utils/pipes'
import { sortTweetsByCreatedAt } from '@/utils/helper'
import type { PostInfoWithAuthor, RetweetInfo } from '@/types/queries'

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
  const data = await queryUserPostsByTag(tag)
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

export async function getUserFollowByTag(tag: string) {
  const data = await queryUserFollowByTag(tag)
  return data
}

export async function getPostById(postId: string) {
  const data = await queryPostById(postId)
  return data
}

export async function getCommentsByPostId(postId: string) {
  const data = await queryCommentsByPostId(postId)
  return data
}

export async function getNotificationsByUserId(userId: string) {
  const data = await queryNotificationsByUserId(userId)
  return data
}

export async function getFollowTweetsByUserId(userId: string) {
  const data = await queryFollowTweetsByUserId(userId)

  const posts = []
  const retweets = []
  for (let { user } of data) {
    const userPosts = user!.posts
    for (let p of userPosts) posts.push(p)
    const userRetweets = user!.retweets
    for (let rt of userRetweets) retweets.push(rt)
  }

  const piped = pipePostsToTweets(posts as PostInfoWithAuthor[])
  const pipedRt = pipeRetweetsToTweets(retweets as RetweetInfo[])
  const tweets = piped.concat(pipedRt)
  sortTweetsByCreatedAt(tweets)

  return tweets
}
