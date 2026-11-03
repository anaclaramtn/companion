import { Link } from 'react-router'

function ProfileLink({
  user,
  currentUserId,
  children,
  className = '',
  onClick,
}) {
  const isCurrentUser = Number(user.id) === Number(currentUserId)

  if (isCurrentUser) {
    return <span className={className}>{children}</span>
  }

  return (
    <Link
      to={`/feed/users/${user.id}`}
      aria-label={`Ver perfil de ${user.name}`}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export default ProfileLink
