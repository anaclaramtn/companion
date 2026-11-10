import { Link } from 'react-router'
import { rememberUserName } from '../../services/userNames.js'

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
      onClick={(event) => {
        // Guarda o nome para o link "Voltar" da próxima tela.
        rememberUserName(user)
        onClick?.(event)
      }}
    >
      {children}
    </Link>
  )
}

export default ProfileLink
