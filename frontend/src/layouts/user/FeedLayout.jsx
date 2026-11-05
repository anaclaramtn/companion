import { useCallback, useState } from 'react'
import { Outlet } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Background from '../../components/common/Background.jsx'
import FeedHeader from '../../components/common/Header.jsx'
import MainNavigation from '../../components/common/MainNavigation.jsx'
import PostComposerModal from '../../components/post/PostComposerModal.jsx'
import ProfileSummary from '../../components/common/ProfileSummary.jsx'
import {
  mockPostReportReasons,
  mockPostsResponse,
} from '../../data/mockPosts.js'
import { mockSubjects } from '../../data/mockSubjects.js'
import { mockRepliesByPost } from '../../data/mockPostReplies.js'
import {
  mockCurrentUser,
  mockUserSubjects,
} from '../../data/mockPublicUsers.js'

const navigationItems = [
  { to: '/feed', label: 'Feed', icon: 'bi-house', end: true },
  { to: '/explorar', label: 'Explorar', icon: 'bi-search' },
  { to: '/salvos', label: 'Salvos', icon: 'bi-bookmark' },
  { to: '/configuracoes', label: 'Configurações', icon: 'bi-gear' },
]

function authorSummary(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl,
  }
}

function FeedLayout() {
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(mockCurrentUser)
  const [currentUserSubjects, setCurrentUserSubjects] = useState(
    mockUserSubjects[mockCurrentUser.id] ?? [],
  )
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
        author: authorSummary(currentUser),
        subjects: selectedSubjects,
        title,
        content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
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
      author: authorSummary(currentUser),
      content,
      createdAt: new Date().toISOString(),
      reportedByCurrentUser: false,
    }

    setRepliesByPost((currentReplies) => ({
      ...currentReplies,
      [postId]: [newReply, ...(currentReplies[postId] ?? [])],
    }))
  }

  // Guarda a curtida no estado compartilhado para que ela apareça em todas as
  // telas (inclusive na aba "Curtidos" do perfil).
  function handleLikeChange(postId, liked) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByCurrentUser: liked,
              likeCount: post.likeCount + (liked ? 1 : -1),
            }
          : post,
      ),
    )
  }

  function handleSaveChange(postId, saved) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, savedByCurrentUser: saved } : post,
      ),
    )
  }

  // Atualiza o perfil e a autoria exibida nos posts e respostas da conta.
  // subjects é opcional (ex.: a troca de username não altera as matérias).
  function handleProfileUpdate(user, subjects) {
    const author = authorSummary(user)
    const withAuthor = (item) =>
      item.author.id === user.id ? { ...item, author } : item

    setCurrentUser(user)
    if (subjects) setCurrentUserSubjects(subjects)
    setPosts((currentPosts) => currentPosts.map(withAuthor))
    setRepliesByPost((currentReplies) =>
      Object.fromEntries(
        Object.entries(currentReplies).map(([postId, replies]) => [
          postId,
          replies.map(withAuthor),
        ]),
      ),
    )
  }

  function handleReport(report) {
    setReports((currentReports) => [report, ...currentReports])
  }

  // A quantidade de respostas é sempre calculada a partir das respostas
  // existentes, para nunca divergir do que aparece no detalhe do post.
  const postsWithCounts = posts.map((post) => ({
    ...post,
    commentCount: repliesByPost[post.id]?.length ?? 0,
  }))

  return (
    <Background>
      <div className="mx-auto min-h-dvh w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        <FeedHeader
          onPostQuestion={() => setIsComposerOpen(true)}
          userAvatarUrl={currentUser.avatarUrl}
          // A busca fica na página Explorar; o campo do cabeçalho não é usado.
          showSearch={false}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <MainNavigation items={navigationItems} />
            <ProfileSummary
              name={currentUser.name}
              followingCount={currentUser.followingCount}
              followersCount={currentUser.followerCount}
              avatarUrl={currentUser.avatarUrl}
              to="/perfil"
            />
          </aside>

          <main className="min-w-0">
            <Outlet
              context={{
                posts: postsWithCounts,
                repliesByPost,
                currentUser,
                currentUserId: currentUser.id,
                currentUserSubjects,
                subjects: mockSubjects,
                onProfileUpdate: handleProfileUpdate,
                reportReasons: mockPostReportReasons,
                onCreateReply: handleCreateReply,
                onLikeChange: handleLikeChange,
                onSaveChange: handleSaveChange,
                onReport: handleReport,
              }}
            />
          </main>
        </div>
      </div>
      {isComposerOpen && (
        <PostComposerModal
          subjects={mockSubjects}
          featuredSubjectIds={currentUserSubjects.map((item) => item.subject.id)}
          onClose={closeComposer}
          onSubmit={handleCreatePost}
        />
      )}
    </Background>
  )
}

export default FeedLayout
