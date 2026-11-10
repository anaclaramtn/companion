import { useState } from 'react'
import { sendPasswordResetEmail } from '../services/accountService.js'
import { useAuth } from './useAuth.js'
import { useToast } from './useToast.js'

// Envia o link de alteração de senha para o e-mail da conta logada e avisa o
// resultado com um toast. Usado em Configurações da conta e em Ajuda e suporte.
export function usePasswordResetEmail() {
  const showToast = useToast()
  const { user } = useAuth()
  const [isSending, setIsSending] = useState(false)

  async function sendEmail() {
    if (isSending) return
    setIsSending(true)
    try {
      const { email } = await sendPasswordResetEmail(user?.email)
      showToast(`E-mail enviado com sucesso para ${email}.`)
    } catch {
      showToast('Não foi possível enviar o e-mail. Tente novamente.', {
        type: 'error',
      })
    } finally {
      setIsSending(false)
    }
  }

  return { sendEmail, isSending }
}
