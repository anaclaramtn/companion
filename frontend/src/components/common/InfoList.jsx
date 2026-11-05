// Lista de informações somente leitura, agrupada sob um título.
// items: lista de { id, label, value, icon, hint }; value vazio vira "Não informado".
function InfoList({ id, title, items }) {
  const titleId = `info-list-${id}`

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
      <dl>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b border-companion-border/50 px-5 py-4 last:border-b-0 sm:px-6"
          >
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-companion-orange/10 text-lg text-companion-brand"
            >
              <i className={`bi ${item.icon}`} />
            </span>
            <div className="min-w-0 flex-1">
              <dt className="text-xs text-companion-muted">{item.label}</dt>
              <dd
                className={`truncate text-sm font-bold ${
                  item.value ? 'text-companion-text' : 'text-companion-muted'
                }`}
              >
                {item.value || 'Não informado'}
              </dd>
              {item.hint && (
                <dd className="mt-0.5 text-xs text-companion-muted">
                  {item.hint}
                </dd>
              )}
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default InfoList
