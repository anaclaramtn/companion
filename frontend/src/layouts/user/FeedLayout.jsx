import { useCallback, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Background from '../../components/common/Background.jsx'
import FeedHeader from '../../components/common/Header.jsx'
import MainNavigation from '../../components/common/MainNavigation.jsx'
import PostComposerModal from '../../components/post/PostComposerModal.jsx'
import ProfileSummary from '../../components/common/ProfileSummary.jsx'
import { mockPostsResponse } from '../../data/mockPosts.js'
import { mockSubjects } from '../../data/mockSubjects.js'
import { mockRepliesByPost } from '../../data/mockPostReplies.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getAllSubjects, getCourseSubjects } from '../../services/academicService.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import {
  createPost,
  REPORT_REASONS,
  reportContent,
  setPostLiked,
  setPostSaved,
} from '../../services/postService.js'
import { getMySubjects } from '../../services/profileService.js'

// Contadores do perfil que GET /users/me não devolve. Ficam zerados até a
// integração de seguidores e de posts.
const profileCountDefaults = {
  postCount: 0,
  commentCount: 0,
  followerCount: 0,
  followingCount: 0,
}

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
  const { user } = useAuth()
  // Edições feitas em "Editar perfil" e na troca de username. Essas telas
  // ainda são simuladas, então as mudanças ficam só aqui e somem no F5.
  const [profileEdits, setProfileEdits] = useState(null)
  const currentUser = { ...profileCountDefaults, ...user, ...profileEdits }
  // As disciplinas do usuário chegam com a integração de disciplinas.
  const [currentUserSubjects, setCurrentUserSubjects] = useState([])
  const [posts, setPosts] = useState(mockPostsResponse.content)
  const [repliesByPost, setRepliesByPost] = useState(mockRepliesByPost)
  const [, setReports] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const showToast = useToast()
  // Disciplinas da janela "Postar dúvida": a grade do curso (ou todas) e,
  // em destaque, as do perfil. null enquanto carregam.
  const [composerSubjects, setComposerSubjects] = useState(null)
  const [composerSubjectsError, setComposerSubjectsError] = useState('')
  // Muda a cada dúvida publicada para o feed recarregar a primeira página.
  const [feedRefreshKey, setFeedRefreshKey] = useState(0)

  const closeComposer = useCallback(() => {
    setIsComposerOpen(false)
  }, [])

  // Abre a janela e busca as disciplinas a cada abertura, para refletir
  // mudanças de curso ou de disciplinas do perfil.
  async function openComposer() {
    setIsComposerOpen(true)
    setComposerSubjects(null)
    setComposerSubjectsError('')
    try {
      const [catalog, mySubjects] = await Promise.all([
        user?.courseId ? getCourseSubjects(user.courseId) : getAllSubjects(),
        getMySubjects(),
      ])
      setComposerSubjects({
        list: catalog,
        featuredIds: mySubjects.map((item) => item.subject.id),
      })
    } catch (error) {
      setComposerSubjectsError(
        getApiErrorMessage(error, 'Não foi possível carregar as disciplinas.'),
      )
    }
  }

  // Erros chegam à janela de publicação, que mostra a mensagem e mantém o texto.
  async function handleCreatePost({ title, content, subjectIds }) {
    await createPost({ title, content, subjectIds })
    closeComposer()
    showToast('Dúvida publicada.')
    setFeedRefreshKey((key) => key + 1)
    // A dúvida nova aparece no topo do feed.
    if (location.pathname !== '/feed') navigate('/feed')
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

  // Ações das telas que já usam o banco (feed, detalhe e Salvos). Erros
  // mostram um toast e voltam para quem chamou, que desfaz a mudança na tela
  // (ou, na denúncia, mantém a janela aberta com a mensagem).
  async function likePost(postId, liked) {
    try {
      return await setPostLiked(postId, liked)
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Não foi possível registrar a curtida.'), {
        type: 'error',
      })
      throw error
    }
  }

  async function savePost(postId, saved) {
    try {
      await setPostSaved(postId, saved)
      showToast(saved ? 'Dúvida salva.' : 'Dúvida removida dos salvos.')
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Não foi possível atualizar seus salvos.'), {
        type: 'error',
      })
      throw error
    }
  }

  async function reportItem({ targetType, targetId, reasonId, details }) {
    const { alreadyReported } = await reportContent({
      targetType,
      targetId,
      reason: reasonId,
      details,
    })
    showToast(
      alreadyReported
        ? 'Você já tinha denunciado este conteúdo.'
        : 'Denúncia enviada. Obrigado por avisar.',
    )
  }

  // Atualiza o perfil e a autoria exibida nos posts e respostas da conta.
  // subjects é opcional (ex.: a troca de username não altera as matérias).
  function handleProfileUpdate(updatedUser, subjects) {
    const author = authorSummary(updatedUser)
    const withAuthor = (item) =>
      item.author.id === updatedUser.id ? { ...item, author } : item

    setProfileEdits(updatedUser)
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
          onPostQuestion={openComposer}
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
                reportReasons: REPORT_REASONS,
                onCreateReply: handleCreateReply,
                // Ações sobre posts do banco (feed, detalhe e Salvos).
                onLikePost: likePost,
                onSavePost: savePost,
                onReportItem: reportItem,
                // PROVISÓRIO: ações sobre os posts falsos de Explorar e dos
                // perfis; saem quando essas telas forem integradas.
                onLikeChange: handleLikeChange,
                onSaveChange: handleSaveChange,
                onReport: handleReport,
                feedRefreshKey,
              }}
            />
          </main>
        </div>
      </div>
      {isComposerOpen && (
        <PostComposerModal
          subjects={composerSubjects?.list ?? null}
          featuredSubjectIds={composerSubjects?.featuredIds ?? []}
          subjectsError={composerSubjectsError}
          onClose={closeComposer}
          onSubmit={handleCreatePost}
        />
      )}
    </Background>
  )
}

export default FeedLayout
