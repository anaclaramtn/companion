import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import LoadMoreTrigger from '../../components/common/LoadMoreTrigger.jsx'
import TagSearchInput from '../../components/common/TagSearchInput.jsx'
import PostCard from '../../components/post/PostCard.jsx'
import ProfileLink from '../../components/user/ProfileLink.jsx'
import { usePaginatedPosts } from '../../hooks/usePaginatedPosts.js'
import { useToast } from '../../hooks/useToast.js'
import { getAllSubjects, getTrendingSubjects } from '../../services/academicService.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import { getPosts } from '../../services/postService.js'
import { searchUsers } from '../../services/publicProfileService.js'

const MAX_SUGGESTIONS = 5
const MAX_STUDENTS = 5
// Espera o usuário parar de digitar antes de buscar na API.
const SEARCH_DELAY_MS = 350

// Ignora maiúsculas e acentos: "programacao" encontra "Programação".
function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')
}

// Uma etiqueta combina com a disciplina pelo nome ou pelo começo do código
// (ex.: "t39" encontra T390).
function matchesSubject(subject, tag) {
  return (
    normalize(subject.name).includes(tag) ||
    normalize(subject.code).startsWith(tag)
  )
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function ExplorePage() {
  const showToast = useToast()
  const [query, setQuery] = useState('')
  // Matéria escolhida como filtro. A API filtra por uma matéria de cada vez.
  const [tag, setTag] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [trending, setTrending] = useState({ isLoading: true, items: [], error: '' })
  // O trecho depois do último "#" é uma etiqueta ainda em digitação.
  const hashIndex = query.lastIndexOf('#')
  const textQuery = (hashIndex === -1 ? query : query.slice(0, hashIndex)).trim()
  const tagDraft = hashIndex === -1 ? null : normalize(query.slice(hashIndex + 1))
  const [searchedText, setSearchedText] = useState('')

  // Disciplinas para as sugestões de "#" e matérias em alta.
  useEffect(() => {
    let active = true
    getAllSubjects()
      .then((list) => {
        if (active) setSubjects(list)
      })
      // Sem a lista, só não aparecem sugestões.
      .catch(() => {})
    getTrendingSubjects()
      .then((items) => {
        if (active) setTrending({ isLoading: false, items, error: '' })
      })
      .catch((error) => {
        if (!active) return
        setTrending({
          isLoading: false,
          items: [],
          error: getApiErrorMessage(error, 'Não foi possível carregar as matérias em alta.'),
        })
      })
    return () => {
      active = false
    }
  }, [])

  // Só busca depois que a pessoa para de digitar.
  useEffect(() => {
    const timer = window.setTimeout(() => setSearchedText(textQuery), SEARCH_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [textQuery])

  const suggestions =
    tagDraft === null
      ? []
      : subjects
          .filter((subject) => matchesSubject(subject, tagDraft) && subject.id !== tag?.id)
          .map((subject) => subject.name)
          .slice(0, MAX_SUGGESTIONS)

  function handleAddTag(tagName) {
    const text = normalize(tagName)
    const subject = subjects.find(
      (item) => normalize(item.name) === text || normalize(item.code) === text,
    )
    if (!subject) {
      showToast(`Nenhuma matéria encontrada para “${tagName}”.`, { type: 'error' })
      return
    }
    // Uma matéria por vez: a nova etiqueta substitui a anterior.
    setTag(subject)
  }

  const isSearching = searchedText !== '' || tag !== null
  const searchLabel = [tag && `#${tag.name}`, searchedText].filter(Boolean).join(' ')

  return (
    <section aria-labelledby="explore-title" className="space-y-5">
      <h1
        id="explore-title"
        className="text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
      >
        Explorar
      </h1>

      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <TagSearchInput
          id="explore-search"
          label="Buscar por dúvidas, tags ou usuários"
          placeholder="Buscar por dúvidas, #matérias ou estudantes..."
          query={query}
          tags={tag ? [tag.name] : []}
          suggestions={suggestions}
          onQueryChange={setQuery}
          onAddTag={handleAddTag}
          onRemoveTag={() => setTag(null)}
        />
      </form>

      {isSearching && (
        <ExploreResults
          // Uma busca nova recomeça a lista do zero.
          key={`${searchedText}|${tag?.id ?? ''}`}
          text={searchedText}
          subjectId={tag?.id}
          searchLabel={searchLabel}
        />
      )}

      <section
        aria-labelledby="trending-title"
        className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
      >
        <header className="border-b border-companion-border/60 px-5 py-4 sm:px-6">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand">
            Assuntos em alta
          </p>
          <h2
            id="trending-title"
            className="mt-1 text-lg font-bold text-companion-text"
          >
            Matérias com mais dúvidas nos últimos 7 dias
          </h2>
        </header>

        {trending.isLoading ? (
          <p role="status" className="px-6 py-8 text-sm text-companion-muted">
            Carregando...
          </p>
        ) : trending.error ? (
          <p role="alert" className="px-6 py-8 text-sm font-semibold text-red-700">
            {trending.error}
          </p>
        ) : trending.items.length > 0 ? (
          <ol>
            {trending.items.map((subject, index) => (
              <li
                key={subject.id}
                className="border-b border-companion-border/50 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setTag(subject)}
                  className="block w-full px-5 py-3 text-left transition-colors hover:bg-white/80 sm:px-6"
                >
                  <span className="block text-xs text-companion-muted">
                    {index + 1} · Disciplina {subject.code}
                  </span>
                  <span className="block font-bold text-companion-text">
                    #{subject.name}
                  </span>
                  <span className="block text-xs text-companion-muted">
                    {subject.postCount} {subject.postCount === 1 ? 'dúvida' : 'dúvidas'}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="px-6 py-8 text-sm text-companion-muted">
            Nenhuma dúvida foi publicada nos últimos 7 dias.
          </p>
        )}
      </section>
    </section>
  )
}

// Resultado de uma busca: estudantes (quando há texto) e dúvidas, do banco.
function ExploreResults({ text, subjectId, searchLabel }) {
  const { currentUserId, reportReasons, onLikePost, onSavePost, onReportItem } =
    useOutletContext()
  const fetchPage = useCallback(
    (page) => getPosts({ page, query: text || undefined, subjectId }),
    [text, subjectId],
  )
  const { posts, totalElements, isLoading, error, hasMore, loadMore, retry } =
    usePaginatedPosts(fetchPage)
  const isFirstLoad = isLoading && posts.length === 0

  return (
    <>
      {text && <StudentResults text={text} currentUserId={currentUserId} />}

      <section aria-labelledby="related-posts-title" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="related-posts-title"
            className="text-lg font-bold text-companion-text"
          >
            Dúvidas relacionadas
          </h2>
          {!isFirstLoad && !error && (
            <span role="status" className="shrink-0 text-sm text-companion-muted">
              {totalElements} {totalElements === 1 ? 'resultado' : 'resultados'}
            </span>
          )}
        </div>

        {isFirstLoad ? (
          <p role="status" className="text-sm text-companion-muted">
            Buscando dúvidas...
          </p>
        ) : posts.length === 0 && !error ? (
          <p className="rounded-2xl border border-companion-border/70 bg-companion-surface px-6 py-8 text-sm text-companion-muted shadow-sm">
            Nenhuma dúvida encontrada para “{searchLabel}”.
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              reportReasons={reportReasons}
              onLikeChange={onLikePost}
              onSaveChange={onSavePost}
              onReport={onReportItem}
              detailsHref={`/feed/posts/${post.id}`}
            />
          ))
        )}

        {error ? (
          <div role="alert" className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
            >
              Tentar de novo
            </button>
          </div>
        ) : (
          hasMore && posts.length > 0 && (
            <LoadMoreTrigger
              onLoadMore={loadMore}
              isLoading={isLoading}
              label="Carregar mais dúvidas"
            />
          )
        )}
      </section>
    </>
  )
}

// Até 5 estudantes cujo nome, username, bio ou matérias combinam com o texto.
function StudentResults({ text, currentUserId }) {
  const [result, setResult] = useState({ isLoading: true, users: [], total: 0, error: '' })

  useEffect(() => {
    let active = true
    searchUsers(text, { size: MAX_STUDENTS })
      .then((page) => {
        if (active) {
          setResult({ isLoading: false, users: page.content, total: page.totalElements, error: '' })
        }
      })
      .catch((error) => {
        if (!active) return
        setResult({
          isLoading: false,
          users: [],
          total: 0,
          error: getApiErrorMessage(error, 'Não foi possível buscar estudantes.'),
        })
      })
    return () => {
      active = false
    }
  }, [text])

  // Sem nenhum estudante encontrado, a seção não aparece.
  if (!result.isLoading && !result.error && result.users.length === 0) return null

  return (
    <section
      aria-labelledby="student-results-title"
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      <header className="flex items-center justify-between gap-4 border-b border-companion-border/60 px-5 py-4 sm:px-6">
        <h2 id="student-results-title" className="text-lg font-bold text-companion-text">
          Estudantes
        </h2>
        {result.total > MAX_STUDENTS && (
          <span className="text-sm text-companion-muted">
            {MAX_STUDENTS} de {result.total}
          </span>
        )}
      </header>
      {result.isLoading ? (
        <p role="status" className="px-6 py-6 text-sm text-companion-muted">
          Buscando estudantes...
        </p>
      ) : result.error ? (
        <p role="alert" className="px-6 py-6 text-sm font-semibold text-red-700">
          {result.error}
        </p>
      ) : (
        <ul>
          {result.users.map((user) => (
            <li key={user.id} className="border-b border-companion-border/50 last:border-b-0">
              <ProfileLink
                user={user}
                currentUserId={currentUserId}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/80 sm:px-6"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-companion-orange/10 text-xs font-bold text-companion-brand"
                  >
                    {initials(user.name)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-companion-text">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs text-companion-muted">
                    @{user.username}
                    {user.course ? ` · ${user.course}` : ''}
                  </span>
                </span>
              </ProfileLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ExplorePage
