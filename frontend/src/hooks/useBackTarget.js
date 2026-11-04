import { useContext } from 'react'
import { NavigationHistoryContext } from '../contexts/NavigationHistoryContext.js'
import { getRouteLabel } from '../routes/routeLabels.js'

// Descobre para onde o "Voltar" deve levar: a tela aberta antes desta.
// Sem tela anterior (ex.: endereço aberto direto), usa o destino padrão.
export function useBackTarget(fallbackTo, fallbackLabel) {
  const paths = useContext(NavigationHistoryContext)
  const previousPath = paths.at(-2)

  if (!previousPath || previousPath === '/login') {
    return { to: fallbackTo, label: fallbackLabel, isHistory: false }
  }

  return {
    to: previousPath,
    label: getRouteLabel(previousPath),
    isHistory: true,
  }
}
