import { useParams } from 'react-router'
import ProfileView from '../../components/user/ProfileView.jsx'

// Perfil de outro estudante (/feed/users/:userId). A key recria a tela ao
// trocar de perfil, para não mostrar dados do anterior enquanto carrega.
function PublicProfilePage() {
  const { userId } = useParams()
  return <ProfileView key={userId} userId={userId} />
}

export default PublicProfilePage
