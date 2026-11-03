import { useContext } from 'react'
import { ToastContext } from '../contexts/ToastContext.js'

// Retorna showToast(message, { type }) para exibir um aviso temporário.
// type: 'success' (padrão) ou 'error'.
export function useToast() {
  const showToast = useContext(ToastContext)
  if (!showToast) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.')
  }
  return showToast
}
