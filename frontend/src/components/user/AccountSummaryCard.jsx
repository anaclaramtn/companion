function AccountSummaryCard({ user }) {
  const details = [
    user.course,
    user.semester ? `${user.semester}º semestre` : null,
  ].filter(Boolean)

  return (
    <section
      aria-label="Sua conta"
      className="flex items-center gap-4 rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
    >
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

      <div className="min-w-0">
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
    </section>
  )
}

export default AccountSummaryCard
