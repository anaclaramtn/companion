import { useMemo, useState } from 'react'
import { mockTrendingSubjects } from '../../data/mockExploreSubjects.js'

function ExplorePage() {
  const [query, setQuery] = useState('')
  const subjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    if (!normalizedQuery) return mockTrendingSubjects

    return mockTrendingSubjects.filter((subject) =>
      subject.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery),
    )
  }, [query])

  return (
    <section aria-labelledby="explore-title" className="space-y-5">
      <h1
        id="explore-title"
        className="text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
      >
        Explorar
      </h1>

      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="explore-search" className="sr-only">
          Buscar por dúvidas, tags ou usuários
        </label>
        <div className="relative">
          <i
            aria-hidden="true"
            className="bi bi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-companion-muted"
          />
          <input
            id="explore-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por dúvidas, tags ou usuários..."
            className="h-12 w-full rounded-xl border border-companion-border/70 bg-companion-surface pl-11 pr-4 text-sm text-companion-text shadow-sm outline-none transition placeholder:text-companion-muted focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
          />
        </div>
      </form>

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

        {subjects.length > 0 ? (
          <ol>
            {subjects.map((subject, index) => (
              <li
                key={subject.id}
                className="border-b border-companion-border/50 px-5 py-3 last:border-b-0 sm:px-6"
              >
                <p className="text-xs text-companion-muted">
                  {index + 1} · Assunto acadêmico
                </p>
                <h3 className="font-bold text-companion-text">
                  #{subject.name}
                </h3>
                <p className="text-xs text-companion-muted">
                  {subject.postCount} posts
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p role="status" className="px-6 py-8 text-sm text-companion-muted">
            Nenhum assunto encontrado para “{query}”.
          </p>
        )}
      </section>
    </section>
  )
}

export default ExplorePage
