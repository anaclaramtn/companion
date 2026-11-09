import { useEffect, useState } from 'react'
import { setAccessToken, setUnauthorizedHandler } from '../api/api.js'
import { login as loginRequest, register as registerRequest } from '../services/authService.js'
import { completeOnboarding as completeOnboardingRequest, updateRequiredProfile } from '../services/profileService.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAccessToken(null)
      setSession(null)
    })
    return () => setUnauthorizedHandler(() => {})
  }, [])

  function acceptSession(authResponse) {
    setAccessToken(authResponse.accessToken)
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

  async function completeOnboarding() {
    const updatedUser = await completeOnboardingRequest()
    setSession((current) => current ? { ...current, user: updatedUser } : current)
    return updatedUser
  }

  function logout() {
    setAccessToken(null)
    setSession(null)
  }

  const value = {
    accessToken: session?.accessToken ?? null,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.accessToken),
    login,
    register,
    updateProfile,
    completeOnboarding,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
