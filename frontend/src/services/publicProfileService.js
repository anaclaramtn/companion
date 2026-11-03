import { mockRepliesByPost } from '../data/mockPostReplies.js'
import { mockPostsResponse } from '../data/mockPosts.js'
import {
  mockCurrentUser,
  mockPublicUsers,
  mockUserFollowLists,
  mockUserFollowStatuses,
  mockUserSubjects,
} from '../data/mockPublicUsers.js'

const followStatuses = Object.fromEntries(
  Object.entries(mockUserFollowStatuses).map(([userId, status]) => [
    userId,
    { ...status },
  ]),
)
const followLists = Object.fromEntries(
  Object.entries(mockUserFollowLists).map(([userId, lists]) => [
    userId,
    {
      followers: [...lists.followers],
      following: [...lists.following],
    },
  ]),
)

function mockResponse(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 180)
  })
}

function pageResponse(content, page = 0, size = 10, totalElements = content.length) {
  return {
    content,
    page,
    size,
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    first: page === 0,
    last: true,
  }
}

function getUserSummary(userId) {
  const user = [mockCurrentUser, ...mockPublicUsers].find(
    (item) => item.id === Number(userId),
  )
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl,
  }
}

function getRelationPage(userId, relation, { page = 0, size = 20 } = {}) {
  const userIds = followLists[userId]?.[relation] ?? []
  const users = userIds.map(getUserSummary).filter(Boolean)
  const content = users.slice(page * size, (page + 1) * size)
  return mockResponse(pageResponse(content, page, size, users.length))
}

export async function getUserById(userId) {
  const user = mockPublicUsers.find((item) => item.id === Number(userId))
  if (!user) throw new Error('Este perfil não foi encontrado.')
  return mockResponse(user)
}

export function getUserSubjects(userId) {
  return mockResponse(mockUserSubjects[userId] ?? [])
}

export function getPostsByAuthorId(userId, { page = 0, size = 10 } = {}) {
  const posts = mockPostsResponse.content
    .filter((post) => post.author.id === Number(userId))
    .map(({ savedByCurrentUser: _savedByCurrentUser, ...post }) => post)
  return mockResponse(pageResponse(posts, page, size))
}

export function getUserComments(userId, { page = 0, size = 10 } = {}) {
  const postsById = new Map(
    mockPostsResponse.content.map((post) => [post.id, post]),
  )
  const comments = Object.values(mockRepliesByPost)
    .flat()
    .filter((reply) => reply.author.id === Number(userId))
    .map((reply) => ({
      id: reply.id,
      postId: reply.postId,
      postTitle: postsById.get(reply.postId)?.title ?? '',
      author: reply.author,
      content: reply.content,
      createdAt: reply.createdAt,
      ownedByCurrentUser: reply.author.id === 0,
    }))
  return mockResponse(pageResponse(comments, page, size))
}

export function getUserFollowStatus(userId) {
  const status = followStatuses[userId] ?? {
    userId: Number(userId),
    followedByCurrentUser: false,
    followerCount: 0,
    followingCount: 0,
  }
  return mockResponse({ ...status })
}

export function getUserFollowers(userId, options = {}) {
  return getRelationPage(userId, 'followers', options)
}

export function getUserFollowing(userId, options = {}) {
  return getRelationPage(userId, 'following', options)
}

export async function followUser(userId) {
  const status = followStatuses[userId]
  if (status && !status.followedByCurrentUser) {
    status.followedByCurrentUser = true
    status.followerCount += 1
    const followers = followLists[userId]?.followers
    if (followers && !followers.includes(mockCurrentUser.id)) {
      followers.unshift(mockCurrentUser.id)
    }
  }
  return mockResponse(status ? { ...status } : undefined)
}

export async function unfollowUser(userId) {
  const status = followStatuses[userId]
  if (status?.followedByCurrentUser) {
    status.followedByCurrentUser = false
    status.followerCount = Math.max(0, status.followerCount - 1)
    const followers = followLists[userId]?.followers
    if (followers) {
      followLists[userId].followers = followers.filter(
        (followerId) => followerId !== mockCurrentUser.id,
      )
    }
  }
  return mockResponse(undefined)
}
