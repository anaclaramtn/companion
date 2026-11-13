import { useEffect } from 'react'
import ProfileLink from './ProfileLink.jsx'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function UserListPopup({
  title,
  users,
  currentUserId,
  isLoading,
  error,
  onClose,
  onRetry,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-list-popup-title"
        aria-busy={isLoading}
        className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-[0_20px_60px_rgba(40,24,12,0.24)]"
      >
        <header className="flex items-center justify-between border-b border-companion-border/70 px-5 py-4">
          <h2
            id="user-list-popup-title"
            className="text-lg font-bold text-companion-text"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar lista"
            className="grid size-9 place-items-center rounded-lg text-companion-muted transition hover:bg-companion-orange/10 hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <p role="status" className="px-5 py-10 text-center text-sm text-companion-muted">
              Carregando usuários…
            </p>
          ) : error ? (
            <div className="px-5 py-8 text-center">
              <p role="alert" className="text-sm text-companion-text">
                {error}
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
              >
                Tentar novamente
              </button>
            </div>
          ) : users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  className="border-b border-companion-border/50 px-5 py-3 last:border-b-0"
                >
                  <ProfileLink
                    user={user}
                    currentUserId={currentUserId}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
                  >
                    <UserAvatar user={user} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-companion-text">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-companion-muted">
                        @{user.username}
                      </span>
                    </span>
                  </ProfileLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-companion-muted">
              Não há usuários para exibir.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function UserAvatar({ user }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className="size-11 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-full bg-companion-orange/10 text-xs font-bold text-companion-brand"
    >
      {initials(user.name)}
    </span>
  )
}

export default UserListPopup
