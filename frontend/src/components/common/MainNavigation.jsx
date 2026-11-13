import { NavLink } from 'react-router'

function MainNavigation({ items }) {
  const linkClassName =
    'flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-lg font-semibold transition-colors'

  return (
    <nav aria-label="Navegação principal">
      <ul className="flex flex-wrap gap-1 lg:flex-col">
        {items.map(({ to, label, icon, end, badge }) => (
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
                      : 'text-companion-muted hover:bg-companion-panel/80 hover:text-companion-text',
                  ].join(' ')
                }
              >
                <i className={`bi ${icon} text-xl`} aria-hidden="true" />
                {label}
                {badge > 0 && (
                  <span className="ml-auto rounded-md bg-companion-orange px-2 py-0.5 text-xs font-bold text-white">
                    {badge}
                    <span className="sr-only"> pendentes</span>
                  </span>
                )}
              </NavLink>
            ) : (
              <span
                aria-disabled="true"
                className={`${linkClassName} cursor-not-allowed text-companion-muted/75`}
              >
                <i className={`bi ${icon} text-xl`} aria-hidden="true" />
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
