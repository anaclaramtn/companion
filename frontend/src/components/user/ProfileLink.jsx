import { Link } from 'react-router'

function ProfileLink({
  user,
  currentUserId,
  children,
  className = '',
  onClick,
}) {
  const isCurrentUser = Number(user.id) === Number(currentUserId)

  return (
    <Link
      to={isCurrentUser ? '/perfil' : `/feed/users/${user.id}`}
      aria-label={isCurrentUser ? 'Ver meu perfil' : `Ver perfil de ${user.name}`}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export default ProfileLink
