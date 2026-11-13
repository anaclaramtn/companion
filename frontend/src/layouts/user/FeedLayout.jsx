import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Background from '../../components/common/Background.jsx'
import FeedHeader from '../../components/common/Header.jsx'
import MainNavigation from '../../components/common/MainNavigation.jsx'
import PostComposerModal from '../../components/post/PostComposerModal.jsx'
import PostDetailModal from '../../components/post/PostDetailModal.jsx'
import { PostActionsContext } from '../../contexts/postActionsContext.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getAllSubjects, getCourseSubjects } from '../../services/academicService.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import {
  createPost,
  deletePost,
  deleteReply,
  REPORT_REASONS,
  reportContent,
  setPostLiked,
  setPostSaved,
} from '../../services/postService.js'
import { getMySubjects } from '../../services/profileService.js'
import { getUserById } from '../../services/publicProfileService.js'

// Contadores do perfil que GET /users/me não devolve. Ficam zerados até o
// perfil público da conta (GET /users/{id}) responder.
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

function FeedLayout() {
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const { user } = useAuth()
  // Seguidores, seguidos, posts e respostas da conta, para a lateral. O resto
  // vem do usuário da sessão, que Editar perfil e Configurações atualizam.
  const [myCounts, setMyCounts] = useState(null)
  const currentUser = { ...profileCountDefaults, ...user, ...myCounts }

  const userId = user?.id
  useEffect(() => {
    if (userId == null) return undefined
    let active = true
    getUserById(userId)
      .then((profile) => {
        if (!active) return
        setMyCounts({
          postCount: profile.postCount,
          commentCount: profile.commentCount,
          followerCount: profile.followerCount,
          followingCount: profile.followingCount,
        })
      })
      // Sem os números, a lateral só continua mostrando zero.
      .catch(() => {})
    return () => {
      active = false
    }
  }, [userId])

  // Seguir ou deixar de seguir alguém muda o "seguindo" da conta.
  const handleFollowingChange = useCallback((delta) => {
    setMyCounts((counts) =>
      counts
        ? { ...counts, followingCount: Math.max(0, counts.followingCount + delta) }
        : counts,
    )
  }, [])
  const navigate = useNavigate()
  const location = useLocation()
  // A dúvida abre numa janela por cima da tela atual: o id fica em ?duvida=ID,
  // então o link continua funcionando ao recarregar ou compartilhar.
  const [searchParams, setSearchParams] = useSearchParams()
  const postParam = searchParams.get('duvida')
  const openPostId = /^\d+$/.test(postParam ?? '') ? postParam : null
  const closePostModal = useCallback(() => {
    // Aberta por um clique na lista, volta no histórico (o botão "voltar" do
    // navegador também fecha a janela). Aberta por link direto, só tira o ?duvida.
    if (location.state?.postModal) {
      navigate(-1)
      return
    }
    const next = new URLSearchParams(searchParams)
    next.delete('duvida')
    setSearchParams(next, { replace: true })
  }, [location.state, navigate, searchParams, setSearchParams])
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

  // Ações sobre as dúvidas, usadas em todas as telas que mostram PostCard. Erros
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

  // Exclusão de dúvidas e respostas. O autor apaga as próprias; administração e
  // moderação apagam de qualquer pessoa (o backend confere a permissão de novo).
  const canModerate = ['ADMIN', 'MODERATOR'].includes(user?.role)
  const [removedPostIds, setRemovedPostIds] = useState(() => new Set())

  const removePost = useCallback(
    async (postId) => {
      try {
        await deletePost(postId)
      } catch (error) {
        // 404: já tinha sido apagada (ex.: por outra pessoa); só some da tela.
        if (error.response?.status !== 404) {
          showToast(getApiErrorMessage(error, 'Não foi possível excluir a dúvida.'), {
            type: 'error',
          })
          throw error
        }
      }
      setRemovedPostIds((current) => new Set(current).add(Number(postId)))
      showToast('Dúvida excluída.')
    },
    [showToast],
  )

  const removeReply = useCallback(
    async (replyId) => {
      try {
        await deleteReply(replyId)
      } catch (error) {
        if (error.response?.status !== 404) {
          showToast(getApiErrorMessage(error, 'Não foi possível excluir a resposta.'), {
            type: 'error',
          })
          throw error
        }
      }
      showToast('Resposta excluída.')
    },
    [showToast],
  )

  const postActions = useMemo(
    () => ({ canModerate, removedPostIds, deletePost: removePost, deleteReply: removeReply }),
    [canModerate, removedPostIds, removePost, removeReply],
  )

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

  return (
    <PostActionsContext.Provider value={postActions}>
    <Background>
      <div className="mx-auto min-h-dvh w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        <FeedHeader
          onPostQuestion={openComposer}
          userName={currentUser.name || 'Meu perfil'}
          userAvatarUrl={currentUser.avatarUrl}
          followingCount={currentUser.followingCount}
          followersCount={currentUser.followerCount}
          // A busca fica na página Explorar; o campo do cabeçalho não é usado.
          showSearch={false}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <MainNavigation items={navigationItems} />
          </aside>

          <main className="min-w-0">
            <Outlet
              context={{
                currentUser,
                currentUserId: currentUser.id,
                reportReasons: REPORT_REASONS,
                // Curtir, salvar e denunciar dúvidas e respostas (gravam no banco).
                onLikePost: likePost,
                onSavePost: savePost,
                onReportItem: reportItem,
                feedRefreshKey,
                onFollowingChange: handleFollowingChange,
              }}
            />
          </main>
        </div>
      </div>
      {openPostId && (
        <PostDetailModal
          postId={openPostId}
          onClose={closePostModal}
          reportReasons={REPORT_REASONS}
          currentUserId={currentUser.id}
          onLikePost={likePost}
          onSavePost={savePost}
          onReportItem={reportItem}
        />
      )}
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
    </PostActionsContext.Provider>
  )
}

export default FeedLayout
