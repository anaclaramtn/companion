import { useId, useState } from 'react'
import { Link } from 'react-router'
import AuthBrand from '../../features/auth/components/AuthBrand.jsx'

function HeaderWaves() {
  return (
    // O corte arredondado fica nesta camada, e não no <header>, para o cartão
    // do perfil poder sair para fora do cabeçalho.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1060 94"
        preserveAspectRatio="none"
        className="size-full"
      >
        <defs>
          {/* Painel claro: creme -> pêssego, da esquerda para a direita */}
          <linearGradient id="fh-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--hw-panel-a)' }} />
            <stop offset="0.65" style={{ stopColor: 'var(--hw-panel-b)' }} />
            <stop offset="1" style={{ stopColor: 'var(--hw-panel-c)' }} />
          </linearGradient>

          {/* Onda laranja: mais clara em cima, mais saturada embaixo */}
          <linearGradient id="fh-orange" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--hw-orange-a)' }} />
            <stop offset="1" style={{ stopColor: 'var(--hw-orange-b)' }} />
          </linearGradient>

          {/* Faixa escura mais clara, para dar profundidade no lado direito */}
          <linearGradient id="fh-dark-band" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3430" />
            <stop offset="1" stopColor="#171615" />
          </linearGradient>
        </defs>

        {/* 1. Base escura */}
        <rect width="1060" height="94" style={{ fill: 'var(--hw-base)' }} />

        {/* 2. Faixa escura em "S" (sutil), só para criar textura */}
        <path
          d="M690 0 C 760 20, 790 70, 880 94 L 960 94 C 880 70, 850 20, 800 0 Z"
          fill="url(#fh-dark-band)"
          opacity="0.55"
        />

        {/* 3. Onda laranja principal */}
        <path
          d="M500 0 C 560 0, 615 45, 645 94 L 735 94 C 705 60, 690 20, 662 0 Z"
          fill="url(#fh-orange)"
        />

        {/* 4. Painel claro (cobre a base da onda, criando a borda curva) */}
        <path
          d="M0 0 H 515 C 585 8, 635 50, 690 94 H 0 Z"
          fill="url(#fh-light)"
        />

        {/* 5. Faixa pêssego translúcida sobre a onda, logo abaixo dela */}
        <path
          d="M545 94 C 595 62, 650 48, 712 94 Z"
          style={{ fill: 'var(--hw-peach)' }}
          opacity="0.75"
        />

        {/* 6. Linha fina laranja à direita */}
        <path
          d="M1030 0 C 1005 28, 985 60, 950 94"
          fill="none"
          style={{ stroke: 'var(--color-primary)' }}
          strokeWidth="1"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

function ProfileMenu({
  name,
  avatarUrl,
  href,
  followingCount,
  followersCount,
}) {
  const summaryId = useId()

  return (
    <div className="group relative shrink-0">
      <Link
        to={href}
        aria-label={`Ver meu perfil: ${name}`}
        aria-describedby={summaryId}
        className="grid size-12 place-items-center overflow-hidden rounded-full bg-companion-panel/95 text-companion-muted ring-2 ring-white/70 transition hover:ring-companion-orange/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" fill="currentColor" />
          </svg>
        )}
      </Link>

      {/* pt-2 (e não mt-2) mantém o cartão colado à área do hover, para ele
          não sumir quando o mouse sai da bolinha em direção a ele. */}
      <div
        id={summaryId}
        role="tooltip"
        className="invisible absolute right-0 top-full z-40 w-56 translate-y-1 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
      >
        <div className="rounded-2xl border border-companion-border/70 bg-companion-surface p-4 shadow-[0_12px_32px_rgba(69,42,18,0.18)]">
          <p className="truncate font-bold text-companion-text">{name}</p>
          <div className="mt-3 flex gap-6 text-xs text-companion-muted">
            <p>
              <strong className="block text-base text-companion-brand">
                {followingCount}
              </strong>
              seguindo
            </p>
            <p>
              <strong className="block text-base text-companion-brand">
                {followersCount}
              </strong>
              seguidores
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedHeader({
  onPostQuestion,
  userName = 'Meu perfil',
  userAvatarUrl,
  followingCount = 0,
  followersCount = 0,
  profileHref = '/perfil',
  showSearch = true,
}) {
  const [query, setQuery] = useState('')

  function handleSearch(event) {
    // Por enquanto, o campo é só visual: não navega nem envia a busca.
    // Quando existir a tela de search, é aqui que entra a navegação.
    event.preventDefault()
  }

  return (
    <header className="relative isolate z-30 flex min-h-24 flex-wrap items-center gap-x-4 gap-y-3 rounded-3xl border border-companion-border px-4 py-3 shadow-[0_12px_32px_rgba(69,42,18,0.12)] sm:px-6 md:flex-nowrap md:gap-6 md:px-7">
      <HeaderWaves />

      {/* Link do Router (e não <a href>) para trocar de tela sem recarregar
          a página e perder o estado da sessão. */}
      <Link
        to="/feed"
        aria-label="Companion — Feed"
        className="flex min-w-0 items-center gap-3"
      >
        <AuthBrand compact />
      </Link>

      {showSearch && (
        <span
          aria-hidden="true"
          className="hidden h-14 w-px shrink-0 bg-companion-brand/35 md:block"
        />
      )}

      {showSearch && (
        <form
          role="search"
          onSubmit={handleSearch}
          className="relative order-last w-full md:order-none md:w-auto md:max-w-[30rem] md:flex-1"
        >
          <label htmlFor="feed-search" className="sr-only">
            Buscar no Companion
          </label>

          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-companion-muted"
          >
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>

          <input
            id="feed-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar dúvidas, usuários ou matérias..."
            className="h-12 w-full rounded-lg border border-white/40 bg-companion-panel/60 pl-12 pr-4 text-sm text-companion-text shadow-sm outline-none backdrop-blur-md transition placeholder:text-companion-muted focus:border-companion-orange focus:bg-companion-panel/80 focus:ring-4 focus:ring-companion-orange/15"
          />
        </form>
      )}

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onPostQuestion}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-companion-orange px-3 text-sm font-bold text-white shadow-companion-btn transition hover:bg-companion-orange-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange sm:px-5"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Postar dúvida</span>
        </button>

        <ProfileMenu
          name={userName}
          avatarUrl={userAvatarUrl}
          href={profileHref}
          followingCount={followingCount}
          followersCount={followersCount}
        />
      </div>
    </header>
  )
}

export default FeedHeader
