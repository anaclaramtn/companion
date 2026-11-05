import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { NavigationHistoryContext } from '../../contexts/NavigationHistoryContext.js'

// Guarda a ordem das telas abertas para que o "Voltar" saiba qual foi a
// anterior. Acompanha o histórico do navegador: avançar empilha, voltar
// desempilha e redirecionar (replace) troca a tela atual.
function NavigationHistoryProvider({ children }) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const [paths, setPaths] = useState(() => [location.pathname])
  const lastKey = useRef(location.key)

  useEffect(() => {
    if (location.key === lastKey.current) return
    lastKey.current = location.key
    const { pathname } = location

    setPaths((current) => {
      if (navigationType === 'REPLACE') {
        return [...current.slice(0, -1), pathname]
      }
      if (navigationType === 'POP' && current.at(-2) === pathname) {
        return current.slice(0, -1)
      }
      return [...current, pathname]
    })
  }, [location, navigationType])

  return (
    <NavigationHistoryContext.Provider value={paths}>
      {children}
    </NavigationHistoryContext.Provider>
  )
}

export default NavigationHistoryProvider
