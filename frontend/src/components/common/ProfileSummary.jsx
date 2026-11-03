import { Link } from 'react-router'

function ProfileSummary({
  name = 'Seu perfil',
  followingCount = 0,
  followersCount = 0,
  avatarUrl,
  to,
}) {
  const content = (
    <>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="size-12 rounded-full object-cover"
        />
      ) : (
        <div className="grid size-12 place-items-center rounded-full bg-companion-orange/10 text-2xl text-companion-muted">
          <i className="bi bi-person-fill" aria-hidden="true" />
        </div>
      )}
      <p className="mt-3 font-bold text-companion-text">{name}</p>
      <div className="mt-4 flex gap-6 text-xs text-companion-muted">
        <p>
          <strong className="block text-base text-companion-brand">
            {followingCount}
          </strong>
          seguindo
        </p>
        <p>
          <strong className="block text-base text-companion-brand">
            {followersCount}
          </strong>
          seguidores
        </p>
      </div>
    </>
  )

  return (
    <section
      aria-label="Resumo do perfil"
      className="hidden overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm sm:block"
    >
      {to ? (
        <Link
          to={to}
          aria-label={`Ver meu perfil: ${name}`}
          className="block p-5 transition-colors hover:bg-white/80"
        >
          {content}
        </Link>
      ) : (
        <div className="p-5">{content}</div>
      )}
    </section>
  )
}

export default ProfileSummary
