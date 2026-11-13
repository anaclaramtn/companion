import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import SubjectTag from '../common/SubjectTag.jsx'
import { getApiErrorMessage } from '../../services/apiError.js'
import { searchUsers } from '../../services/publicProfileService.js'
import ProfileLink from './ProfileLink.jsx'

const MAX_VISIBLE_SUBJECTS = 3
const PAGE_SIZE = 20

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

// Até 3 matérias que a pessoa domina e "+N" para as demais.
function DominatedSubjects({ subjects = [] }) {
  if (subjects.length === 0) return null
  const extra = subjects.length - MAX_VISIBLE_SUBJECTS
  return (
    <span className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="sr-only">Domina:</span>
      {subjects.slice(0, MAX_VISIBLE_SUBJECTS).map((name) => (
        <SubjectTag key={name} name={name} />
      ))}
      {extra > 0 && (
        <span
          className="text-xs font-semibold text-companion-muted"
          aria-label={`e mais ${extra} ${extra === 1 ? 'matéria' : 'matérias'}`}
        >
          +{extra}
        </span>
      )}
    </span>
  )
}

// Estudantes cujo nome, username ou matérias dominadas combinam com a
// busca, com as matérias que dominam logo abaixo do nome.
function StudentResults({ text, subjectId }) {
  const { currentUserId } = useOutletContext()
  const [result, setResult] = useState({
    isLoading: true,
    users: [],
    total: 0,
    page: 0,
    hasMore: false,
    error: '',
  })
  const [retryKey, setRetryKey] = useState(0)

  const load = useCallback(
    (page) => {
      setResult((current) => ({ ...current, isLoading: true, error: '' }))
      searchUsers(text, { subjectId, page, size: PAGE_SIZE })
        .then((data) => {
          setResult((current) => ({
            isLoading: false,
            users: page === 0 ? data.content : [...current.users, ...data.content],
            total: data.totalElements,
            page,
            hasMore: page + 1 < data.totalPages,
            error: '',
          }))
        })
        .catch((error) => {
          setResult((current) => ({
            ...current,
            isLoading: false,
            error: getApiErrorMessage(error, 'Não foi possível buscar estudantes.'),
          }))
        })
    },
    [text, subjectId],
  )

  useEffect(() => {
    load(0)
  }, [load, retryKey])

  const isFirstLoad = result.isLoading && result.users.length === 0

  return (
    <section aria-labelledby="student-results-title" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="student-results-title" className="text-lg font-bold text-companion-text">
          Estudantes
        </h2>
        {!isFirstLoad && !result.error && (
          <span role="status" className="shrink-0 text-sm text-companion-muted">
            {result.total} {result.total === 1 ? 'resultado' : 'resultados'}
          </span>
        )}
      </div>

      {isFirstLoad ? (
        <p role="status" className="text-sm text-companion-muted">
          Buscando estudantes...
        </p>
      ) : result.users.length === 0 && !result.error ? (
        <p className="rounded-2xl border border-companion-border/70 bg-companion-surface px-6 py-8 text-sm text-companion-muted shadow-sm">
          Nenhum estudante encontrado.
        </p>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm">
          {result.users.map((user) => (
            <li key={user.id} className="border-b border-companion-border/50 last:border-b-0">
              <ProfileLink
                user={user}
                currentUserId={currentUserId}
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-companion-panel/80 sm:px-6"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="size-11 shrink-0 rounded-full object-cover" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-companion-orange/10 text-xs font-bold text-companion-brand"
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
                  <DominatedSubjects subjects={user.dominatedSubjects} />
                </span>
              </ProfileLink>
            </li>
          ))}
        </ul>
      )}

      {result.error ? (
        <div role="alert" className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="text-sm font-semibold text-red-700">{result.error}</p>
          <button
            type="button"
            onClick={() => setRetryKey((key) => key + 1)}
            className="rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
          >
            Tentar de novo
          </button>
        </div>
      ) : (
        result.hasMore && (
          <div className="text-center">
            <button
              type="button"
              disabled={result.isLoading}
              onClick={() => load(result.page + 1)}
              className="rounded-xl border border-companion-border bg-companion-panel px-4 py-2 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5 disabled:opacity-60"
            >
              {result.isLoading ? 'Carregando...' : 'Carregar mais estudantes'}
            </button>
          </div>
        )
      )}
    </section>
  )
}

export default StudentResults
