import { useState } from 'react'
import { Link } from 'react-router'
import AuthBrand from '../../features/auth/components/AuthBrand.jsx'

function HeaderWaves() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1060 94"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 -z-10 size-full rounded-[inherit]"
    >
      <defs>
        {/* Painel claro: creme -> pêssego, da esquerda para a direita */}
        <linearGradient id="fh-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff8f1" />
          <stop offset="0.65" stopColor="#ffe6cc" />
          <stop offset="1" stopColor="#ffbd82" />
        </linearGradient>

        {/* Onda laranja: mais clara em cima, mais saturada embaixo */}
        <linearGradient id="fh-orange" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ff9a1f" />
          <stop offset="1" stopColor="#f26a00" />
        </linearGradient>

        {/* Faixa escura mais clara, para dar profundidade no lado direito */}
        <linearGradient id="fh-dark-band" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3430" />
          <stop offset="1" stopColor="#171615" />
        </linearGradient>
      </defs>

      {/* 1. Base escura */}
      <rect width="1060" height="94" fill="#171615" />

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
        fill="#ffc592"
        opacity="0.75"
      />

      {/* 6. Linha fina laranja à direita */}
      <path
        d="M1030 0 C 1005 28, 985 60, 950 94"
        fill="none"
        stroke="#ff8a00"
        strokeWidth="1"
        opacity="0.7"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function FeedHeader({
  onPostQuestion,
  userName = 'Meu perfil',
  userAvatarUrl,
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
    <header className="relative isolate flex min-h-24 flex-wrap items-center gap-x-4 gap-y-3 overflow-hidden rounded-3xl border border-companion-border px-4 py-3 shadow-[0_12px_32px_rgba(69,42,18,0.12)] sm:px-6 md:flex-nowrap md:gap-6 md:px-7">
      <HeaderWaves />

      <a
        href="/feed"
        aria-label="Companion — Feed"
        className="flex min-w-0 items-center gap-3"
      >
        <AuthBrand compact />
      </a>

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
            className="h-12 w-full rounded-full border border-white/40 bg-white/60 pl-12 pr-4 text-sm text-companion-text shadow-sm outline-none backdrop-blur-md transition placeholder:text-companion-muted focus:border-companion-orange focus:bg-white/80 focus:ring-4 focus:ring-companion-orange/15"
          />
        </form>
      )}

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onPostQuestion}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-companion-orange px-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,133,0,0.28)] transition hover:bg-companion-orange-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange sm:px-5"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Postar dúvida</span>
        </button>

        <Link
          to={profileHref}
          aria-label={userName}
          className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white/95 text-companion-muted ring-2 ring-white/70 transition hover:ring-companion-orange/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
        >
          {userAvatarUrl ? (
            <img src={userAvatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
              <circle cx="12" cy="8" r="4" fill="currentColor" />
              <path d="M4.5 21a7.5 7.5 0 0 1 15 0" fill="currentColor" />
            </svg>
          )}
        </Link>
      </div>
    </header>
  )
}

export default FeedHeader
