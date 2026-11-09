import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

function RequireAuth() {
  const { isAuthenticated, isRestoring, user } = useAuth()
  const location = useLocation()

  // Depois do F5, espera a API confirmar o token salvo antes de decidir.
  // Sem isso, a pessoa seria mandada para o login (ou para a Etapa 1) por um
  // instante, enquanto os dados do usuário ainda estão chegando.
  if (isRestoring) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-companion-cream text-sm font-semibold text-companion-muted"
      >
        Carregando sessão...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!user?.profileComplete && location.pathname !== '/onboarding/etapa-1') {
    return <Navigate to="/onboarding/etapa-1" replace />
  }

  return <Outlet />
}

export default RequireAuth
