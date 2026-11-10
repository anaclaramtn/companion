import { useEffect, useRef } from 'react'

// Fim de uma lista paginada. Chama onLoadMore quando chega perto da tela
// (rolagem infinita) e também mostra um botão, para quem navega pelo teclado
// ou quando o navegador não suporta IntersectionObserver.
function LoadMoreTrigger({ onLoadMore, isLoading, label = 'Carregar mais' }) {
  const sentinelRef = useRef(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore()
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [onLoadMore])

  return (
    <div ref={sentinelRef} className="flex justify-center py-4">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        className="rounded-xl border border-companion-border bg-white px-4 py-2 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5 disabled:cursor-default disabled:opacity-60"
      >
        {isLoading ? 'Carregando...' : label}
      </button>
    </div>
  )
}

export default LoadMoreTrigger
