import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { ThemeContext } from './themeContext.js'

// Preferências de aparência. Ficam só neste navegador (localStorage): a API não
// guarda configurações de acessibilidade. O mesmo caminho/chave é usado pelo
// script do index.html, que aplica o tema antes do React carregar (sem "piscar").
const STORAGE_KEY = 'companion.appearance'

export const THEMES = ['light', 'dark']
export const COLOR_VISIONS = ['default', 'red-green', 'blue-yellow']

const DEFAULT_PREFERENCES = { theme: 'light', colorVision: 'default' }

// As telas de acesso e o onboarding têm visual próprio (CSS fixo); nelas o
// app continua no tema claro padrão, e as preferências valem do feed em diante.
function isAuthScreen(pathname) {
  return (
    pathname === '/' ||
    ['/login', '/criar-conta', '/confirmar-email', '/recuperar-senha'].includes(pathname) ||
    pathname.startsWith('/onboarding')
  )
}

function readPreferences() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return {
      theme: THEMES.includes(saved?.theme) ? saved.theme : DEFAULT_PREFERENCES.theme,
      colorVision: COLOR_VISIONS.includes(saved?.colorVision)
        ? saved.colorVision
        : DEFAULT_PREFERENCES.colorVision,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

function savePreferences(preferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Armazenamento bloqueado: a escolha vale só até recarregar a página.
  }
}

export function ThemeProvider({ children }) {
  const [preferences, setPreferences] = useState(readPreferences)
  const { pathname } = useLocation()

  const effective = isAuthScreen(pathname) ? DEFAULT_PREFERENCES : preferences

  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.theme = effective.theme
    root.dataset.colorVision = effective.colorVision
  }, [effective.theme, effective.colorVision])

  const setTheme = useCallback((theme) => {
    setPreferences((current) => {
      const next = { ...current, theme }
      savePreferences(next)
      return next
    })
  }, [])

  const setColorVision = useCallback((colorVision) => {
    setPreferences((current) => {
      const next = { ...current, colorVision }
      savePreferences(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ ...preferences, setTheme, setColorVision }),
    [preferences, setTheme, setColorVision],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
