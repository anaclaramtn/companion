import { useNavigate } from 'react-router'
import { homePathFor } from '../../routes/homePath.js'

// Para onde ir depois de um login: aceite dos termos (primeiro acesso),
// onboarding (perfil incompleto) ou a tela inicial.
export function useFinishSignIn() {
  const navigate = useNavigate()

  return function finishSignIn({ needsTerms, session }) {
    if (needsTerms) {
      navigate('/aceitar-termos')
      return
    }
    navigate(session.user.profileComplete ? homePathFor(session.user.role) : '/onboarding/etapa-1', {
      replace: true,
    })
  }
}
