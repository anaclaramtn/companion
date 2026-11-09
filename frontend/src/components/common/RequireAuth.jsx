import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

function RequireAuth() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!user?.profileComplete && location.pathname !== '/onboarding/etapa-1') {
    return <Navigate to="/onboarding/etapa-1" replace />
  }

  return <Outlet />
}

export default RequireAuth
