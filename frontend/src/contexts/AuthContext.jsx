import { useEffect, useState } from 'react'
import { setAccessToken, setUnauthorizedHandler } from '../api/api.js'
import { login as loginRequest, register as registerRequest } from '../services/authService.js'
import {
  completeOnboarding as completeOnboardingRequest,
  getCurrentUser,
  uploadProfileAvatar,
  updateRequiredProfile,
} from '../services/profileService.js'
import { AuthContext } from './authContext.js'

// SOLUÇÃO PROVISÓRIA (apresentação): o access token fica salvo no
// localStorage para a sessão sobreviver ao F5. Qualquer script que rode na
// página consegue ler o localStorage, então um XSS poderia roubar o token.
// A solução definitiva é access token só em memória + refresh token em cookie
// HttpOnly. Ver a seção "SESSÃO E AUTENTICAÇÃO" do GUIA_COMPONENTES.txt.
const TOKEN_STORAGE_KEY = 'companion.accessToken'

// O acesso ao localStorage pode falhar (ex.: navegação privada com
// armazenamento bloqueado); nesse caso a sessão só dura até o F5.
function readStoredToken() {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function storeToken(token) {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  } catch {
    // Sem armazenamento disponível: a sessão continua apenas em memória.
  }
}

export function AuthProvider({ children }) {
  // Ao abrir a página, retoma o token salvo. O usuário ainda é desconhecido
  // (user: null) até a resposta de GET /users/me.
  const [session, setSession] = useState(() => {
    const token = readStoredToken()
    setAccessToken(token)
    return token ? { accessToken: token, user: null } : null
  })

  // Há token mas ainda não há usuário: a sessão está sendo restaurada.
  const isRestoring = Boolean(session?.accessToken) && !session.user
  const restoringToken = isRestoring ? session.accessToken : null

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAccessToken(null)
      storeToken(null)
      setSession(null)
    })
    return () => setUnauthorizedHandler(() => {})
  }, [])

  // Confere com a API se o token salvo ainda vale e busca os dados atuais do
  // usuário. Se o token expirou, a API responde 401 e o handler acima limpa
  // a sessão; se a API estiver fora do ar, a pessoa volta ao login.
  useEffect(() => {
    if (!restoringToken) return undefined

    let cancelled = false
    getCurrentUser()
      .then((user) => {
        if (cancelled) return
        setSession((current) =>
          current?.accessToken === restoringToken ? { ...current, user } : current,
        )
      })
      .catch(() => {
        if (cancelled) return
        setAccessToken(null)
        setSession(null)
      })

    return () => {
      cancelled = true
    }
  }, [restoringToken])

  function acceptSession(authResponse) {
    setAccessToken(authResponse.accessToken)
    storeToken(authResponse.accessToken)
    const nextSession = {
      accessToken: authResponse.accessToken,
      user: authResponse.user,
    }
    setSession(nextSession)
    return nextSession
  }

  async function login(identifier, password) {
    return acceptSession(await loginRequest(identifier, password))
  }

  async function register(email, password) {
    return acceptSession(await registerRequest(email, password))
  }

  async function updateProfile(profile) {
    const updatedUser = await updateRequiredProfile(profile)
    setSession((current) => current ? { ...current, user: updatedUser } : current)
    return updatedUser
  }

  async function updateAvatar(file) {
    const updatedUser = await uploadProfileAvatar(file)
    setSession((current) => current ? { ...current, user: updatedUser } : current)
    return updatedUser
  }

  async function completeOnboarding() {
    const updatedUser = await completeOnboardingRequest()
    setSession((current) => current ? { ...current, user: updatedUser } : current)
    return updatedUser
  }

  function logout() {
    setAccessToken(null)
    storeToken(null)
    setSession(null)
  }

  const value = {
    accessToken: session?.accessToken ?? null,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.user),
    isRestoring,
    login,
    register,
    updateProfile,
    updateAvatar,
    completeOnboarding,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
