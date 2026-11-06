import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AuthCard from '../../features/auth/components/AuthCard.jsx'
import '../../features/auth/components/AuthForm.css'
import { useToast } from '../../hooks/useToast.js'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import {
  confirmEmail,
  resendConfirmationEmail,
} from '../../services/authService.js'

const RESEND_COOLDOWN_SECONDS = 30

// Exibida logo após o cadastro: a conta só segue para a criação do perfil
// depois que o e-mail é confirmado pelo link enviado.
function EmailConfirmationPage() {
  const { state } = useLocation()
  const email = state?.email
  const showToast = useToast()
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS)
  const [isResending, setIsResending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  async function handleResend() {
    setIsResending(true)
    try {
      await resendConfirmationEmail(email)
      showToast(`Enviamos um novo link para ${email}.`)
      setSecondsLeft(RESEND_COOLDOWN_SECONDS)
    } catch {
      showToast('Não foi possível reenviar o e-mail. Tente novamente.', {
        type: 'error',
      })
    } finally {
      setIsResending(false)
    }
  }

  async function handleConfirm() {
    setIsConfirming(true)
    await confirmEmail()
    setConfirmed(true)
  }

  // Sem e-mail do cadastro (ex.: endereço aberto direto), volta ao cadastro.
  if (!email) return <Navigate to="/criar-conta" replace />
  if (confirmed) return <Navigate to="/onboarding/etapa-1" replace />

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="CONFIRME SEU E-MAIL"
        title="Verifique sua caixa de entrada."
        description="Para ativar sua conta, abra o link que enviamos para:"
        footer={
          <span>
            E-mail errado?{' '}
            <Link className="text-button" to="/criar-conta">
              Voltar ao cadastro
            </Link>
          </span>
        }
      >
        <div className="grid gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-companion-border bg-companion-orange/10 px-4 py-3">
            <i
              className="bi bi-envelope-check text-2xl text-companion-brand"
              aria-hidden="true"
            />
            <strong className="min-w-0 break-all text-sm text-companion-text">
              {email}
            </strong>
          </div>

          <p className="text-sm text-companion-muted">
            O link vale por 24 horas. Se não encontrar a mensagem, confira a
            caixa de spam ou de lixo eletrônico.
          </p>

          <button
            type="button"
            className="submit-button"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Confirmando…' : 'Já confirmei meu e-mail'}
          </button>
          <p className="-mt-2 text-center text-xs text-companion-muted">
            Protótipo: este botão simula o clique no link do e-mail.
          </p>

          <p className="text-center text-sm text-companion-muted">
            Não recebeu?{' '}
            {secondsLeft > 0 ? (
              <span>Você poderá reenviar em {secondsLeft}s.</span>
            ) : (
              <button
                type="button"
                className="text-button"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? 'Reenviando…' : 'Reenviar e-mail'}
              </button>
            )}
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}

export default EmailConfirmationPage
