import { NavLink } from 'react-router'

function MainNavigation({ items }) {
  const linkClassName =
    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors'

  return (
    <nav
      aria-label="Navegação principal"
      className="rounded-2xl border border-companion-border/70 bg-companion-surface p-3 shadow-sm"
    >
      <ul className="flex flex-wrap gap-1 lg:flex-col">
        {items.map(({ to, label, icon, end }) => (
          <li key={label} className="min-w-fit flex-1 lg:flex-none">
            {to ? (
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    linkClassName,
                    isActive
                      ? 'bg-companion-orange/10 text-companion-brand'
                      : 'text-companion-muted hover:bg-white/80 hover:text-companion-text',
                  ].join(' ')
                }
              >
                <i className={`bi ${icon}`} aria-hidden="true" />
                {label}
              </NavLink>
            ) : (
              <span
                aria-disabled="true"
                className={`${linkClassName} cursor-not-allowed text-companion-muted/75`}
              >
                <i className={`bi ${icon}`} aria-hidden="true" />
                {label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MainNavigation
