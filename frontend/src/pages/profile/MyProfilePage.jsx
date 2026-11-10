import { useOutletContext } from 'react-router'
import ProfileView from '../../components/user/ProfileView.jsx'

// Perfil da própria conta (/perfil): os mesmos dados que outros estudantes
// veem, com "Editar perfil" e a aba "Curtidos".
function MyProfilePage() {
  const { currentUserId } = useOutletContext()
  return <ProfileView key={currentUserId} userId={currentUserId} />
}

export default MyProfilePage
