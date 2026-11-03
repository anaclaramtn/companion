// Pergunta expansível: o <details> nativo cuida de abrir/fechar e do teclado.
function FaqItem({ question, answer }) {
  return (
    <details className="group border-b border-companion-border/50 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 text-sm font-bold text-companion-text transition-colors hover:bg-white/80 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{question}</span>
        <i
          aria-hidden="true"
          className="bi bi-chevron-down shrink-0 text-companion-muted transition-transform group-open:rotate-180"
        />
      </summary>
      <p className="px-5 pb-5 text-sm leading-relaxed text-companion-muted sm:px-6">
        {answer}
      </p>
    </details>
  )
}

export default FaqItem
