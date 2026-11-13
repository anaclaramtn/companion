import { Link } from 'react-router'

// Cartão da conta autenticada. Com "to", o cartão inteiro vira um link.
function AccountSummaryCard({ user, to }) {
  const details = [
    user.course,
    user.semester ? `${user.semester}º semestre` : null,
  ].filter(Boolean)

  const content = (
    <>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt=""
          className="size-16 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-companion-orange/10 text-3xl text-companion-muted">
          <i className="bi bi-person-fill" aria-hidden="true" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold text-companion-text">
          {user.name}
        </p>
        <p className="truncate text-sm text-companion-muted">
          @{user.username}
        </p>
        {details.length > 0 && (
          <p className="mt-1 text-xs text-companion-muted">
            {details.join(' · ')}
          </p>
        )}
      </div>

      {to && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-companion-muted">
          Ver perfil
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </span>
      )}
    </>
  )

  const className = 'flex items-center gap-4 p-5 sm:p-6'

  return (
    <section
      aria-label="Sua conta"
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      {to ? (
        <Link
          to={to}
          className={`${className} transition-colors hover:bg-companion-panel/80`}
        >
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </section>
  )
}

export default AccountSummaryCard
