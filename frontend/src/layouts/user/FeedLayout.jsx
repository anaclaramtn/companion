import { useCallback, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Background from '../../components/common/Background.jsx'
import FeedHeader from '../../components/common/Header.jsx'
import MainNavigation from '../../components/common/MainNavigation.jsx'
import PostComposerModal from '../../components/post/PostComposerModal.jsx'
import ProfileSummary from '../../components/common/ProfileSummary.jsx'
import {
  mockPostReportReasons,
  mockPostsResponse,
  mockSubjects,
} from '../../data/mockPosts.js'
import { mockRepliesByPost } from '../../data/mockPostReplies.js'
import { mockCurrentUser } from '../../data/mockPublicUsers.js'

const navigationItems = [
  { to: '/feed', label: 'Feed', icon: 'bi-house', end: true },
  { to: '/explorar', label: 'Explorar', icon: 'bi-search' },
  { label: 'Salvos', icon: 'bi-bookmark' },
  { label: 'Configurações', icon: 'bi-gear' },
]

function FeedLayout() {
  const { pathname } = useLocation()
  const isExplorePage = pathname === '/explorar'
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [posts, setPosts] = useState(mockPostsResponse.content)
  const [repliesByPost, setRepliesByPost] = useState(mockRepliesByPost)
  const [, setReports] = useState([])

  const closeComposer = useCallback(() => {
    setIsComposerOpen(false)
  }, [])

  function handleCreatePost({ title, content, subjectIds }) {
    const selectedSubjects = mockSubjects.filter((subject) =>
      subjectIds.includes(subject.id),
    )

    setPosts((currentPosts) => [
      {
        id: Date.now(),
        author: {
          id: 0,
          name: 'Você',
          username: 'voce',
          avatarUrl: null,
        },
        subjects: selectedSubjects,
        title,
        content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        likedByCurrentUser: false,
        savedByCurrentUser: false,
        ownedByCurrentUser: true,
      },
      ...currentPosts,
    ])
    closeComposer()
  }

  function handleCreateReply(postId, content) {
    const newReply = {
      id: Date.now(),
      postId,
      author: {
        id: 0,
        name: 'Você',
        username: 'voce',
        avatarUrl: null,
      },
      content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByCurrentUser: false,
      reportedByCurrentUser: false,
    }

    setRepliesByPost((currentReplies) => ({
      ...currentReplies,
      [postId]: [newReply, ...(currentReplies[postId] ?? [])],
    }))
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount + 1 }
          : post,
      ),
    )
  }

  function handleReport(report) {
    setReports((currentReports) => [report, ...currentReports])
  }

  return (
    <Background>
      <div className="mx-auto min-h-dvh w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        <FeedHeader
          onPostQuestion={() => setIsComposerOpen(true)}
          showSearch={!isExplorePage}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <MainNavigation items={navigationItems} />
            <ProfileSummary
              name={mockCurrentUser.name}
              followingCount={mockCurrentUser.followingCount}
              followersCount={mockCurrentUser.followerCount}
              avatarUrl={mockCurrentUser.avatarUrl}
            />
          </aside>

          <main className="min-w-0">
            <Outlet
              context={{
                posts,
                repliesByPost,
                currentUserId: mockCurrentUser.id,
                reportReasons: mockPostReportReasons,
                onCreateReply: handleCreateReply,
                onReport: handleReport,
              }}
            />
          </main>
        </div>
      </div>
      {isComposerOpen && (
        <PostComposerModal
          subjects={mockSubjects}
          onClose={closeComposer}
          onSubmit={handleCreatePost}
        />
      )}
    </Background>
  )
}

export default FeedLayout
