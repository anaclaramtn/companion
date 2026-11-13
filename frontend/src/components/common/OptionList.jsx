import { Link } from 'react-router'

const itemClassName =
  'flex w-full items-center gap-4 px-5 py-4 text-left transition-colors sm:px-6'

function OptionContent({ label, description, icon, tone, unavailable }) {
  const isDanger = tone === 'danger'

  return (
    <>
      <span
        aria-hidden="true"
        className={[
          'grid size-10 shrink-0 place-items-center rounded-xl text-lg',
          isDanger
            ? 'bg-red-50 text-red-600'
            : 'bg-companion-orange/10 text-companion-brand',
        ].join(' ')}
      >
        <i className={`bi ${icon}`} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={[
            'block text-sm font-bold',
            isDanger ? 'text-red-600' : 'text-companion-text',
          ].join(' ')}
        >
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs text-companion-muted">
            {description}
          </span>
        )}
      </span>

      {unavailable ? (
        <span className="shrink-0 rounded-lg bg-companion-border/50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-companion-muted">
          Em breve
        </span>
      ) : (
        !isDanger && (
          <i
            aria-hidden="true"
            className="bi bi-chevron-right shrink-0 text-companion-muted"
          />
        )
      )}
    </>
  )
}

// Lista de opções agrupada sob um título. Cada item navega (to), executa um
// callback (onSelect recebe item.action) ou aparece como indisponível.
function OptionList({ id, title, items, onSelect }) {
  const titleId = `option-list-${id}`

  return (
    <section
      aria-labelledby={titleId}
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      <h2
        id={titleId}
        className="border-b border-companion-border/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand sm:px-6"
      >
        {title}
      </h2>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="border-b border-companion-border/50 last:border-b-0"
          >
            {item.to ? (
              <Link
                to={item.to}
                className={`${itemClassName} hover:bg-companion-panel/80`}
              >
                <OptionContent {...item} />
              </Link>
            ) : item.action ? (
              <button
                type="button"
                onClick={() => onSelect?.(item.action)}
                className={`${itemClassName} hover:bg-companion-panel/80`}
              >
                <OptionContent {...item} />
              </button>
            ) : (
              <div
                aria-disabled="true"
                className={`${itemClassName} cursor-not-allowed opacity-70`}
              >
                <OptionContent {...item} unavailable />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default OptionList
