function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

const countButtonClassName =
  'rounded-sm text-left transition hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange'

// Cabeçalho do perfil: capa, avatar, dados públicos e contagem de seguidores.
// "actions" ocupa o canto direito (ex.: Seguir ou Editar perfil).
function ProfileHeader({
  titleId,
  user,
  followingCount,
  followerCount,
  onOpenRelation,
  actions,
  children,
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm">
      <div
        aria-hidden="true"
        className="h-32 bg-gradient-to-r from-companion-orange to-companion-orange-hover sm:h-40"
      />
      <div className="px-5 pb-6 sm:px-7">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 sm:-mt-14">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="size-24 rounded-full border-4 border-companion-surface bg-companion-surface object-cover sm:size-28"
            />
          ) : (
            <div
              aria-hidden="true"
              className="grid size-24 place-items-center rounded-full border-4 border-companion-surface bg-companion-panel text-2xl font-bold text-companion-brand sm:size-28"
            >
              {initials(user.name)}
            </div>
          )}
          {actions}
        </div>

        <h1
          id={titleId}
          className="mt-3 text-2xl font-bold tracking-tight text-companion-text"
        >
          {user.name}
        </h1>
        <p className="text-sm text-companion-muted">@{user.username}</p>
        {user.bio && (
          <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-companion-text">
            {user.bio}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-companion-muted">
          {user.course && (
            <span className="inline-flex items-center gap-2">
              <i className="bi bi-mortarboard" aria-hidden="true" />
              {user.course}
              {user.semester ? ` · ${user.semester}º semestre` : ''}
            </span>
          )}
          {user.createdAt && (
            <span className="inline-flex items-center gap-2">
              <i className="bi bi-calendar3" aria-hidden="true" />
              Desde {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        <dl className="mt-5 flex gap-6 text-sm text-companion-muted">
          <div>
            <dt className="sr-only">Seguindo</dt>
            <dd>
              <button
                type="button"
                onClick={() => onOpenRelation('following')}
                aria-haspopup="dialog"
                className={countButtonClassName}
              >
                <strong className="text-companion-text">{followingCount}</strong>{' '}
                seguindo
              </button>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Seguidores</dt>
            <dd>
              <button
                type="button"
                onClick={() => onOpenRelation('followers')}
                aria-haspopup="dialog"
                className={countButtonClassName}
              >
                <strong className="text-companion-text">{followerCount}</strong>{' '}
                seguidores
              </button>
            </dd>
          </div>
        </dl>
        {children}
      </div>
    </article>
  )
}

export default ProfileHeader
