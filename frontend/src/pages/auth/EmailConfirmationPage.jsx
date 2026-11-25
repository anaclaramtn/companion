import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AuthCard from '../../features/auth/components/AuthCard.jsx'
import '../../features/auth/components/AuthForm.css'
import { useFinishSignIn } from '../../features/auth/useFinishSignIn.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { getAuthErrorMessage } from '../../services/apiError.js'
import { resendConfirmationEmail } from '../../services/authService.js'

const RESEND_COOLDOWN_SECONDS = 30

// Exibida após o cadastro (ou no login de quem ainda não confirmou): a conta só
// segue adiante depois que o e-mail é confirmado pelo link enviado.
function EmailConfirmationPage() {
  const { state } = useLocation()
  const email = state?.email
  const navigate = useNavigate()
  const finishSignIn = useFinishSignIn()
  const { loginAfterEmailConfirmation } = useAuth()
  const showToast = useToast()
  // Se o primeiro envio falhou, libera o reenvio na hora.
  const [secondsLeft, setSecondsLeft] = useState(
    state?.emailSent === false ? 0 : RESEND_COOLDOWN_SECONDS,
  )
  const [isResending, setIsResending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  // Sem o login pendente no Firebase (ex.: página recarregada), volta ao login.
  function handleError(error, fallback) {
    showToast(getAuthErrorMessage(error, fallback), { type: 'error' })
    if (error.code === 'companion/no-pending-user') navigate('/login', { replace: true })
  }

  async function handleResend() {
    setIsResending(true)
    try {
      await resendConfirmationEmail()
      showToast(`Enviamos um novo link para ${email}.`)
      setSecondsLeft(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      handleError(error, 'Não foi possível reenviar o e-mail. Tente novamente.')
    } finally {
      setIsResending(false)
    }
  }

  async function handleConfirm() {
    setIsConfirming(true)
    try {
      finishSignIn(await loginAfterEmailConfirmation())
    } catch (error) {
      handleError(error, 'Não foi possível entrar. Tente novamente.')
      setIsConfirming(false)
    }
  }

  // Sem e-mail do cadastro (ex.: endereço aberto direto), volta ao cadastro.
  if (!email) return <Navigate to="/criar-conta" replace />

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
            Depois de abrir o link, volte aqui. Se não encontrar a mensagem,
            confira a caixa de spam ou de lixo eletrônico. Se você não criou
            esta conta, não abra o link.
          </p>

          <button
            type="button"
            className="submit-button"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Confirmando…' : 'Já confirmei meu e-mail'}
          </button>

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
