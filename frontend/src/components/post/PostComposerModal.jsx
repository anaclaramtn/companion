import { useEffect, useRef, useState } from 'react'
import { getApiErrorMessage } from '../../services/apiError.js'
import {
  POST_CONTENT_MAX_LENGTH as MAX_CONTENT_LENGTH,
  POST_MAX_SUBJECTS as MAX_SUBJECTS,
  POST_TITLE_MAX_LENGTH as MAX_TITLE_LENGTH,
} from '../../services/postService.js'

const DEFAULT_VISIBLE_SUBJECTS = 10

function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')
}

// subjects: disciplinas que podem ser escolhidas; null enquanto carregam.
// featuredSubjectIds: disciplinas exibidas primeiro (ex.: as do perfil);
// as demais aparecem com a busca ou com "Ver mais".
// subjectsError: mensagem quando as disciplinas não puderam ser carregadas.
// onSubmit deve devolver uma Promise; se ela falhar, a mensagem de erro da
// API aparece na janela e o texto digitado é mantido.
function PostComposerModal({
  subjects: subjectsProp,
  featuredSubjectIds = [],
  subjectsError = '',
  onClose,
  onSubmit,
}) {
  const subjects = subjectsProp ?? []
  const isLoadingSubjects = subjectsProp == null && !subjectsError
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([])
  const [subjectSearch, setSubjectSearch] = useState('')
  const [showAllSubjects, setShowAllSubjects] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const titleInputRef = useRef(null)

  const normalizedSearch = normalize(subjectSearch)
  const isSearching = normalizedSearch !== ''
  const shortListIds =
    featuredSubjectIds.length > 0
      ? featuredSubjectIds
      : subjects.slice(0, DEFAULT_VISIBLE_SUBJECTS).map((subject) => subject.id)
  const visibleSubjects = subjects.filter((subject) => {
    if (isSearching) {
      return (
        normalize(subject.name).includes(normalizedSearch) ||
        normalize(subject.code ?? subject.id).includes(normalizedSearch)
      )
    }
    return (
      showAllSubjects ||
      selectedSubjectIds.includes(subject.id) ||
      shortListIds.includes(subject.id)
    )
  })

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    titleInputRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function toggleSubject(subjectId) {
    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds((selectedIds) =>
        selectedIds.filter((id) => id !== subjectId),
      )
      setError('')
      return
    }

    if (selectedSubjectIds.length >= MAX_SUBJECTS) {
      setError(`Você pode selecionar no máximo ${MAX_SUBJECTS} conteúdos.`)
      return
    }

    setSelectedSubjectIds((selectedIds) => [...selectedIds, subjectId])
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    if (!title.trim() || !content.trim()) {
      setError('Preencha o título e o conteúdo da dúvida.')
      return
    }

    if (selectedSubjectIds.length === 0) {
      setError('Selecione pelo menos 1 conteúdo para a sua dúvida.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        subjectIds: selectedSubjectIds,
      })
    } catch (submitError) {
      setError(
        getApiErrorMessage(submitError, 'Não foi possível publicar sua dúvida. Tente novamente.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 sm:p-6">
      <button
        type="button"
        aria-label="Fechar janela de publicação"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#21170f]/55 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-composer-title"
        className="relative my-auto w-full max-w-2xl rounded-3xl border border-companion-border/70 bg-companion-surface p-5 shadow-[0_24px_80px_rgba(33,23,15,0.28)] sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-companion-brand">
              Nova publicação
            </p>
            <h2
              id="post-composer-title"
              className="mt-1 text-2xl font-bold text-companion-text"
            >
              Poste sua dúvida
            </h2>
            <p className="mt-2 text-sm text-companion-muted">
              Conte o que você gostaria de aprender com a comunidade.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-10 shrink-0 place-items-center rounded-full text-companion-muted transition hover:bg-companion-orange/10 hover:text-companion-brand"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="post-title"
              className="mb-2 block text-sm font-semibold text-companion-text"
            >
              Título da dúvida
            </label>
            <input
              ref={titleInputRef}
              id="post-title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Como funcionam as listas encadeadas?"
              maxLength={MAX_TITLE_LENGTH}
              required
              className="w-full rounded-xl border border-companion-border bg-white/80 px-4 py-3 text-sm text-companion-text outline-none transition placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
            />
            <p className="mt-1 text-right text-xs text-companion-muted">
              {title.length}/{MAX_TITLE_LENGTH}
            </p>
          </div>

          <div>
            <label
              htmlFor="post-content"
              className="mb-2 block text-sm font-semibold text-companion-text"
            >
              Conteúdo da dúvida
            </label>
            <textarea
              id="post-content"
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Descreva sua dúvida com detalhes para que outras pessoas possam ajudar..."
              rows={5}
              maxLength={MAX_CONTENT_LENGTH}
              required
              className="w-full resize-y rounded-xl border border-companion-border bg-white/80 px-4 py-3 text-sm leading-6 text-companion-text outline-none transition placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
            />
            <p className="mt-1 text-right text-xs text-companion-muted">
              {content.length}/{MAX_CONTENT_LENGTH}
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-companion-text">
              Disciplinas relacionadas
              <span className="ml-2 font-normal text-companion-muted">
                (selecione até {MAX_SUBJECTS})
              </span>
            </legend>
            <p className="mt-1 text-xs text-companion-muted">
              {selectedSubjectIds.length} de {MAX_SUBJECTS} selecionados
            </p>
            <label htmlFor="post-subject-search" className="sr-only">
              Buscar disciplina por nome ou código
            </label>
            <div className="relative mt-3">
              <i
                aria-hidden="true"
                className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-companion-muted"
              />
              <input
                id="post-subject-search"
                type="search"
                value={subjectSearch}
                onChange={(event) => setSubjectSearch(event.target.value)}
                placeholder="Buscar disciplina por nome ou código (ex.: T390)"
                className="h-10 w-full rounded-xl border border-companion-border bg-white/80 pl-9 pr-3 text-sm text-companion-text outline-none transition placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
              />
            </div>
            <div className="mt-3 flex max-h-56 flex-wrap gap-2 overflow-y-auto">
              {isLoadingSubjects && (
                <p role="status" className="text-sm text-companion-muted">
                  Carregando disciplinas...
                </p>
              )}
              {subjectsError && (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {subjectsError}
                </p>
              )}
              {!isLoadingSubjects && !subjectsError && visibleSubjects.length === 0 && (
                <p className="text-sm text-companion-muted">
                  Nenhuma disciplina encontrada para “{subjectSearch}”.
                </p>
              )}
              {visibleSubjects.map((subject) => {
                const isSelected = selectedSubjectIds.includes(subject.id)
                const isLimitReached =
                  selectedSubjectIds.length === MAX_SUBJECTS && !isSelected

                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    aria-pressed={isSelected}
                    disabled={isLimitReached}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-companion-orange bg-companion-orange text-white'
                        : 'border-companion-border bg-white/80 text-companion-muted hover:border-companion-orange hover:text-companion-brand'
                    } disabled:cursor-not-allowed disabled:opacity-45`}
                  >
                    {subject.name}
                  </button>
                )
              })}
            </div>
            {!isSearching && subjects.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAllSubjects((showAll) => !showAll)}
                aria-expanded={showAllSubjects}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-companion-brand hover:underline"
              >
                <i
                  className={`bi ${showAllSubjects ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                  aria-hidden="true"
                />
                {showAllSubjects
                  ? 'Ver menos'
                  : `Ver mais: todas as disciplinas (${subjects.length})`}
              </button>
            )}
          </fieldset>

          <div aria-live="polite" className="min-h-5">
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-companion-border/70 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-companion-border px-5 py-3 text-sm font-semibold text-companion-muted transition hover:bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingSubjects}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-companion-orange px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,133,0,0.22)] transition hover:bg-companion-orange-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className="bi bi-send" aria-hidden="true" />
              {isSubmitting ? 'Publicando...' : 'Publicar dúvida'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default PostComposerModal
