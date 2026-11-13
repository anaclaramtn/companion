import { useCallback, useEffect, useState } from 'react'
import { getReports } from '../services/reportService.js'

// Quantidade de denúncias aguardando análise, para o aviso na navegação.
// Só consulta quando enabled (administração e moderação) e atualiza a cada
// minuto; refresh() força a atualização (ex.: depois de analisar uma denúncia).
export function usePendingReports(enabled) {
  const [count, setCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!enabled) return
    try {
      const page = await getReports({ status: 'PENDING', page: 0, size: 1 })
      setCount(page.totalElements)
    } catch {
      // Sem o número, o aviso só não aparece.
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined
    refresh()
    const timer = window.setInterval(refresh, 60000)
    return () => window.clearInterval(timer)
  }, [enabled, refresh])

  return { count: enabled ? count : 0, refresh }
}
