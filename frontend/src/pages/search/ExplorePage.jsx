import { useState } from 'react'
import { useOutletContext } from 'react-router'
import TagSearchInput from '../../components/common/TagSearchInput.jsx'
import PostCard from '../../components/post/PostCard.jsx'
import { mockTrendingSubjects } from '../../data/mockExploreSubjects.js'
import { mockSubjects } from '../../data/mockSubjects.js'

const MAX_SUGGESTIONS = 5

// Ignora maiúsculas e acentos: "programacao" encontra "Programação".
function normalize(text) {
  return text
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
    normalize(subject.id).startsWith(tag)
  )
}

function findSubject(text) {
  const normalizedText = normalize(text)
  return mockSubjects.find(
    (subject) =>
      normalize(subject.name) === normalizedText ||
      normalize(subject.id) === normalizedText,
  )
}

function getPostSubjects(post) {
  return post.subjects ?? (post.subject ? [post.subject] : [])
}

function ExplorePage() {
  const { posts, reportReasons, onLikeChange, onReport, currentUserId } =
    useOutletContext()
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState([])

  // O trecho depois do último "#" é uma etiqueta ainda em digitação.
  const hashIndex = query.lastIndexOf('#')
  const textQuery = normalize(hashIndex === -1 ? query : query.slice(0, hashIndex))
  const tagDraft = hashIndex === -1 ? null : normalize(query.slice(hashIndex + 1))
  const tagFilters = [...tags.map(normalize), tagDraft].filter(Boolean)
  const isSearching = textQuery !== '' || tagFilters.length > 0

  const selectedTags = tags.map(normalize)
  const suggestions =
    tagDraft === null
      ? []
      : mockSubjects
          .filter(
            (subject) =>
              matchesSubject(subject, tagDraft) &&
              !selectedTags.includes(normalize(subject.name)),
          )
          .map((subject) => subject.name)
          .slice(0, MAX_SUGGESTIONS)

  const words = textQuery.split(/\s+/).filter(Boolean)
  const relatedPosts = isSearching
    ? posts.filter((post) => {
        const subjects = getPostSubjects(post)
        const matchesTags =
          tagFilters.length === 0 ||
          tagFilters.some((tag) =>
            subjects.some((subject) => matchesSubject(subject, tag)),
          )
        const searchableText = normalize(
          [
            post.title,
            post.content,
            post.author.name,
            post.author.username,
            ...subjects.flatMap((subject) => [subject.name, subject.id]),
          ].join(' '),
        )
        return (
          matchesTags && words.every((word) => searchableText.includes(word))
        )
      })
    : []

  const trendingSubjects = mockTrendingSubjects.filter((subject) => {
    const matchesTags =
      tagFilters.length === 0 ||
      tagFilters.some((tag) => matchesSubject(subject, tag))
    return matchesTags && normalize(subject.name).includes(textQuery)
  })

  const searchLabel = [...tags.map((tag) => `#${tag}`), query.trim()]
    .filter(Boolean)
    .join(' ')

  function handleAddTag(tagName) {
    // Usa o nome oficial da disciplina quando a etiqueta é o nome ou o código.
    const name = findSubject(tagName)?.name ?? tagName

    setTags((currentTags) =>
      currentTags.some((tag) => normalize(tag) === normalize(name))
        ? currentTags
        : [...currentTags, name],
    )
  }

  function handleRemoveTag(index) {
    setTags((currentTags) => currentTags.filter((_, i) => i !== index))
  }

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
          placeholder="Buscar por dúvidas, #matérias ou usuários..."
          query={query}
          tags={tags}
          suggestions={suggestions}
          onQueryChange={setQuery}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </form>

      {isSearching && (
        <section aria-labelledby="related-posts-title" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="related-posts-title"
              className="text-lg font-bold text-companion-text"
            >
              Posts relacionados
            </h2>
            <span
              role="status"
              className="shrink-0 text-sm text-companion-muted"
            >
              {relatedPosts.length}{' '}
              {relatedPosts.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {relatedPosts.length > 0 ? (
            relatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                reportReasons={reportReasons}
                onLikeChange={onLikeChange}
                onReport={onReport}
                detailsHref={`/feed/posts/${post.id}`}
              />
            ))
          ) : (
            <p className="rounded-2xl border border-companion-border/70 bg-companion-surface px-6 py-8 text-sm text-companion-muted shadow-sm">
              Nenhum post encontrado para “{searchLabel}”.
            </p>
          )}
        </section>
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
            O que está acontecendo
          </h2>
        </header>

        {trendingSubjects.length > 0 ? (
          <ol>
            {trendingSubjects.map((subject, index) => (
              <li
                key={subject.id}
                className="border-b border-companion-border/50 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => handleAddTag(subject.name)}
                  className="block w-full px-5 py-3 text-left transition-colors hover:bg-white/80 sm:px-6"
                >
                  <span className="block text-xs text-companion-muted">
                    {index + 1} · Disciplina {subject.id}
                  </span>
                  <span className="block font-bold text-companion-text">
                    #{subject.name}
                  </span>
                  <span className="block text-xs text-companion-muted">
                    {subject.postCount} posts
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="px-6 py-8 text-sm text-companion-muted">
            Nenhum assunto encontrado para “{searchLabel}”.
          </p>
        )}
      </section>
    </section>
  )
}

export default ExplorePage
